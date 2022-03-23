import { DroppedOnPopupMessageObject } from '~/lib/DroppedOnPopupMessageObject'
import { MessageObject } from '~/lib/MessageObject'
import { PopupClickedMessageObject } from '~/lib/PopupClickedMessageObject'
import { createStickerObject, StickerObject } from '~/lib/StickerObject'

type CloneStickerObject = (stickerObject: StickerObject) => StickerObject

export const cloneStickerObject: CloneStickerObject = ({ src }) =>
  createStickerObject(src)

export type HandlePopupClickedMessageCallback = () => void

type HandlePopupClickedMessage = (
  popupClickedMessageObject: PopupClickedMessageObject
) => Promise<boolean>

type CreateHandlePopupClickedMessage = (
  openFileDialog: () => void,
  handlePopupClickedMessageCallback: HandlePopupClickedMessageCallback
) => HandlePopupClickedMessage

const createHandlePopupClickedMessage: CreateHandlePopupClickedMessage = (
  openFileDialog,
  handlePopupClickedMessageCallback
) => () => {
  openFileDialog()
  handlePopupClickedMessageCallback()
  return Promise.resolve(true)
}

export type HandleDroppedOnPopupMessageCallback = (
  stickerObject: StickerObject
) => void

type HandleDroppedOnPopupMessage = (
  droppedOnPopupMessageObject: DroppedOnPopupMessageObject
) => Promise<boolean>

type CreateHandleDroppedOnPopupMessage = (
  handleDroppedOnPopupMessageCallback: HandleDroppedOnPopupMessageCallback
) => HandleDroppedOnPopupMessage

const createHandleDroppedOnPopupMessage: CreateHandleDroppedOnPopupMessage = handleDroppedOnPopupMessageCallback => ({
  payload
}) => {
  const stickerObject = createStickerObject(payload)
  handleDroppedOnPopupMessageCallback(stickerObject)
  return Promise.resolve(true)
}

type HandleMessage = (
  message: MessageObject,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: boolean) => void
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
        .catch(error => {
          throw error
        })
      break
    case 'droppedOnPopup':
      Promise.resolve()
        .then(() => handleDroppedOnPopupMessage(messageObject))
        .then(sendResponse)
        .catch(error => {
          throw error
        })
      break
    default:
      throw new Error('InvalidMessageTypeError')
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
