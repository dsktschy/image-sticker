import { browser } from 'webextension-polyfill-ts'
import { MessageObject } from '../lib/MessageObject'
import { createStickerObject, StickerObject } from '../lib/StickerObject'

export type OnMessage = (stickerObject: StickerObject) => void

type CreateOnMessageCallback = (props: {
  onMessage: OnMessage
}) => (messageObject: MessageObject) => void

const createOnMessageCallback: CreateOnMessageCallback = ({
  onMessage
}) => messageObject => {
  if (typeof document === 'undefined') throw new Error('NoDocumentError')
  const stickerObject = createStickerObject(messageObject, document)
  onMessage(stickerObject)
}

type InitializeContentScript = (props: { onMessage: OnMessage }) => () => void

export const initializeContentScript: InitializeContentScript = ({
  onMessage
}) => {
  const onMessageCallback = createOnMessageCallback({ onMessage })
  const runtimeOnMessage = browser.runtime.onMessage
  runtimeOnMessage.addListener(onMessageCallback)
  return () => {
    runtimeOnMessage.removeListener(onMessageCallback)
  }
}
