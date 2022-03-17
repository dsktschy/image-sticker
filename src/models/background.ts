import { browser } from 'webextension-polyfill-ts'
import { MessageObject } from '~/lib/MessageObject'
import { getActiveTab } from '~/models/tab_getter'
import { sendMessageToTab } from '~/models/message_sender'

type HandleMessage = (messageObject: MessageObject) => Promise<boolean>

const handleMessage: HandleMessage = messageObject =>
  Promise.resolve()
    .then(getActiveTab)
    .then(tab => {
      switch (messageObject.type) {
        case 'popupClicked':
        case 'droppedOnPopup':
          return sendMessageToTab(messageObject, tab)
        default:
          throw new Error('InvalidMessageTypeError')
      }
    })
    .catch(error => {
      throw error
    })

type InitializeBackground = () => () => void

export const initializeBackground: InitializeBackground = () => {
  const runtimeOnMessage = browser.runtime.onMessage
  runtimeOnMessage.addListener(handleMessage)
  return () => {
    runtimeOnMessage.removeListener(handleMessage)
  }
}
