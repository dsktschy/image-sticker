import { browser } from 'webextension-polyfill-ts'
import { ClickMessageObject } from '~/lib/ClickMessageObject'
import { DropMessageObject } from '~/lib/DropMessageObject'
import { createStickerObject, StickerObject } from '~/lib/StickerObject'

type CloneStickerObject = (stickerObject: StickerObject) => StickerObject

export const cloneStickerObject: CloneStickerObject = ({ src }) =>
  createStickerObject(src)

export type HandleClickMessageCallback = () => void

type HandleClickMessage = () => void

type CreateHandleClickMessage = (
  openFileDialog: () => void,
  handleClickMessageCallback: HandleClickMessageCallback
) => HandleClickMessage

const createHandleClickMessage: CreateHandleClickMessage = (
  openFileDialog,
  handleClickMessageCallback
) => () => {
  openFileDialog()
  handleClickMessageCallback()
}

export type HandleDropMessageCallback = (stickerObject: StickerObject) => void

type HandleDropMessage = (dropMessageObject: DropMessageObject) => void

type CreateHandleDropMessage = (
  handleDropMessageCallback: HandleDropMessageCallback
) => HandleDropMessage

const createHandleDropMessage: CreateHandleDropMessage = handleDropMessageCallback => ({
  payload
}) => {
  const stickerObject = createStickerObject(payload)
  handleDropMessageCallback(stickerObject)
}

type HandleMessage = (
  messageObject: ClickMessageObject | DropMessageObject
) => void

type CreateHandleMessage = (
  handleClickMessage: HandleClickMessage,
  handleDropMessage: HandleDropMessage
) => HandleMessage

const createHandleMessage: CreateHandleMessage = (
  handleClickMessage,
  handleDropMessage
) => messageObject => {
  switch (messageObject.type) {
    case 'click':
      handleClickMessage()
      break
    case 'drop':
      handleDropMessage(messageObject)
      break
    default:
      throw new Error('InvalidMessageTypeError')
  }
}

type InitializeContentScript = (
  openFileDialog: () => void,
  handleClickMessageCallback: HandleClickMessageCallback,
  handleDropMessageCallback: HandleDropMessageCallback
) => () => void

export const initializeContentScript: InitializeContentScript = (
  openFileDialog,
  handleClickMessageCallback,
  handleDropMessageCallback
) => {
  const handleMessage = createHandleMessage(
    createHandleClickMessage(openFileDialog, handleClickMessageCallback),
    createHandleDropMessage(handleDropMessageCallback)
  )
  const runtimeOnMessage = browser.runtime.onMessage
  runtimeOnMessage.addListener(handleMessage)
  return () => {
    runtimeOnMessage.removeListener(handleMessage)
  }
}
