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
) => Promise<Error | null>

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
    if (error instanceof Error) return Promise.resolve(error)
    return Promise.resolve(new Error('HandlePopupClickedMessageError'))
  }
  return Promise.resolve(null)
}

export type HandleDroppedOnPopupMessageCallback = (
  stickerObject: StickerObject
) => void

type HandleDroppedOnPopupMessage = (
  droppedOnPopupMessageObject: DroppedOnPopupMessageObject
) => Promise<Error | null>

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
    if (error instanceof Error) return Promise.resolve(error)
    return Promise.resolve(new Error('HandleDroppedOnPopupMessageError'))
  }
  return Promise.resolve(null)
}

type CreateSendResponseToPopupClickedMessage = (
  error: Error | null,
  sendResponse: (error: Error | null) => void
) => void

const createSendResponseToPopupClickedMessage: CreateSendResponseToPopupClickedMessage = (
  error,
  sendResponse
) => {
  const runtimeOnMessage = chrome.runtime.onMessage
  const handleMessage = () => {
    runtimeOnMessage.removeListener(handleMessage)
    sendResponse(error)
  }
  runtimeOnMessage.addListener(handleMessage)
}

type HandleMessage = (
  message: MessageObject,
  sender: chrome.runtime.MessageSender,
  sendResponse: (error: Error | null) => void
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
        .then(error =>
          createSendResponseToPopupClickedMessage(error, sendResponse)
        )
        .catch(error =>
          createSendResponseToPopupClickedMessage(error, sendResponse)
        )
      break
    case 'droppedOnPopup':
      Promise.resolve()
        .then(() => handleDroppedOnPopupMessage(messageObject))
        .then(sendResponse)
        .catch(sendResponse)
      break
    default:
      sendResponse(new Error('InvalidMessageTypeError'))
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
