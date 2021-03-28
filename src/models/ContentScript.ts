import { browser } from 'webextension-polyfill-ts'
import { MessageObject } from '../lib/MessageObject'
import { createStickerObject, StickerObject } from '../lib/StickerObject'

export type HandleMessageCallback = (stickerObject: StickerObject) => void

type CreateHandleMessage = (
  handleMessageCallback: HandleMessageCallback
) => (messageObject: MessageObject) => void

const createHandleMessage: CreateHandleMessage = handleMessageCallback => messageObject => {
  if (typeof document === 'undefined') throw new Error('NoDocumentError')
  const stickerObject = createStickerObject(messageObject, document)
  handleMessageCallback(stickerObject)
}

type InitializeContentScript = (
  handleMessageCallback: HandleMessageCallback
) => () => void

export const initializeContentScript: InitializeContentScript = handleMessageCallback => {
  const handleMessage = createHandleMessage(handleMessageCallback)
  const runtimeOnMessage = browser.runtime.onMessage
  runtimeOnMessage.addListener(handleMessage)
  return () => {
    runtimeOnMessage.removeListener(handleMessage)
  }
}
