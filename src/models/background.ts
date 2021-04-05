import { browser } from 'webextension-polyfill-ts'
import { sendMessageToActiveTabInCurrentWindow } from './message_sender'

type InitializeBackground = () => () => void

export const initializeBackground: InitializeBackground = () => {
  const runtimeOnMessage = browser.runtime.onMessage
  runtimeOnMessage.addListener(sendMessageToActiveTabInCurrentWindow)
  return () => {
    runtimeOnMessage.removeListener(sendMessageToActiveTabInCurrentWindow)
  }
}
