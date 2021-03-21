import { browser } from 'webextension-polyfill-ts'
import { Message } from '../lib/Message'
import { createSticker, Sticker } from '../lib/Sticker'

export type OnMessage = (props: { stickerList: Sticker[] }) => void

type CreateOnMessageCallback = (props: {
  onMessage: OnMessage
}) => (message: Message) => void

const createOnMessageCallback: CreateOnMessageCallback = ({
  onMessage
}) => message => {
  if (typeof document === 'undefined') throw new Error('NoDocumentError')
  const stickerList = [createSticker(message, document)]
  onMessage({ stickerList })
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
