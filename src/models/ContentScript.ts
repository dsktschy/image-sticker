import { browser } from 'webextension-polyfill-ts'
import { MessageObject } from '../lib/MessageObject'
import { createStickerObject, StickerObject } from '../lib/StickerObject'

export type OnMessageCallback = (stickerObject: StickerObject) => void

type CreateOnMessage = (
  onMessageCallback: OnMessageCallback
) => (messageObject: MessageObject) => void

const createOnMessage: CreateOnMessage = onMessageCallback => messageObject => {
  if (typeof document === 'undefined') throw new Error('NoDocumentError')
  const stickerObject = createStickerObject(messageObject, document)
  onMessageCallback(stickerObject)
}

type InitializeContentScript = (
  onMessageCallback: OnMessageCallback
) => () => void

export const initializeContentScript: InitializeContentScript = onMessageCallback => {
  const onMessage = createOnMessage(onMessageCallback)
  const runtimeOnMessage = browser.runtime.onMessage
  runtimeOnMessage.addListener(onMessage)
  return () => {
    runtimeOnMessage.removeListener(onMessage)
  }
}
