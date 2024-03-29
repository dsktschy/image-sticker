import { CustomError } from '~/lib/CustomError'
import { DroppedOnPopupMessageObject } from '~/lib/DroppedOnPopupMessageObject'
import { MessageObject } from '~/lib/MessageObject'
import { PopupClickedMessageObject } from '~/lib/PopupClickedMessageObject'
import { createStickerObject, StickerObject } from '~/lib/StickerObject'

type CloneStickerObject = (stickerObject: StickerObject) => StickerObject

export const cloneStickerObject: CloneStickerObject = ({ src }) =>
  createStickerObject(src)

type HandlePopupClickedMessageCallback = () => void

type HandlePopupClickedMessage = (
  popupClickedMessageObject: PopupClickedMessageObject
) => Promise<CustomError | null>

type CreateHandlePopupClickedMessage = (
  openFileDialog: () => void,
  handlePopupClickedMessageCallback: HandlePopupClickedMessageCallback
) => HandlePopupClickedMessage

const createHandlePopupClickedMessage: CreateHandlePopupClickedMessage = (
  openFileDialog,
  handlePopupClickedMessageCallback
) => () => {
  try {
    openFileDialog()
    handlePopupClickedMessageCallback()
  } catch (error) {
    if (error instanceof CustomError) return Promise.resolve(error)
    return Promise.resolve(new CustomError('HandlePopupClickedMessageError'))
  }
  return Promise.resolve(null)
}

export type HandleDroppedOnPopupMessageCallback = (
  stickerObject: StickerObject
) => void

type HandleDroppedOnPopupMessage = (
  droppedOnPopupMessageObject: DroppedOnPopupMessageObject
) => Promise<CustomError | null>

type CreateHandleDroppedOnPopupMessage = (
  handleDroppedOnPopupMessageCallback: HandleDroppedOnPopupMessageCallback
) => HandleDroppedOnPopupMessage

const createHandleDroppedOnPopupMessage: CreateHandleDroppedOnPopupMessage = handleDroppedOnPopupMessageCallback => ({
  payload
}) => {
  try {
    const stickerObject = createStickerObject(payload)
    handleDroppedOnPopupMessageCallback(stickerObject)
  } catch (error) {
    if (error instanceof CustomError) return Promise.resolve(error)
    return Promise.resolve(new CustomError('HandleDroppedOnPopupMessageError'))
  }
  return Promise.resolve(null)
}

type HandleMessage = (
  message: MessageObject,
  sender: chrome.runtime.MessageSender,
  sendResponse: (error: CustomError | null) => void
) => boolean

type CreateHandleMessage = (
  handlePopupClickedMessage: HandlePopupClickedMessage,
  handleDroppedOnPopupMessage: HandleDroppedOnPopupMessage
) => HandleMessage

const createHandleMessage: CreateHandleMessage = (
  handlePopupClickedMessage,
  handleDroppedOnPopupMessage
) => (messageObject, sender, sendResponse) => {
  switch (messageObject.type) {
    case 'popupClicked':
      Promise.resolve()
        .then(() => handlePopupClickedMessage(messageObject))
        .then(sendResponse)
        .catch(sendResponse)
      break
    case 'droppedOnPopup':
      Promise.resolve()
        .then(() => handleDroppedOnPopupMessage(messageObject))
        .then(sendResponse)
        .catch(sendResponse)
      break
    default:
      sendResponse(new CustomError('InvalidMessageTypeError'))
  }
  // https://stackoverflow.com/a/71520230/18535330
  return true
}

type InitializeContentScript = (
  openFileDialog: () => void,
  handlePopupClickedMessageCallback: HandlePopupClickedMessageCallback,
  handleDroppedOnPopupMessageCallback: HandleDroppedOnPopupMessageCallback
) => () => void

export const initializeContentScript: InitializeContentScript = (
  openFileDialog,
  handlePopupClickedMessageCallback,
  handleDroppedOnPopupMessageCallback
) => {
  const handleMessage = createHandleMessage(
    createHandlePopupClickedMessage(
      openFileDialog,
      handlePopupClickedMessageCallback
    ),
    createHandleDroppedOnPopupMessage(handleDroppedOnPopupMessageCallback)
  )
  const runtimeOnMessage = chrome.runtime.onMessage
  runtimeOnMessage.addListener(handleMessage)
  return () => {
    runtimeOnMessage.removeListener(handleMessage)
  }
}
