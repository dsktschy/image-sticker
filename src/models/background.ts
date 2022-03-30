import { MessageObject } from '~/lib/MessageObject'
import { getActiveTab } from '~/models/tab_getter'
import { sendMessageToTab } from '~/models/message_sender'

type HandleMessage = (
  message: MessageObject,
  sender: chrome.runtime.MessageSender,
  sendResponse: (error: Error | null) => void
) => boolean

const handleMessage: HandleMessage = (messageObject, sender, sendResponse) => {
  switch (messageObject.type) {
    case 'droppedOnPopup':
      Promise.resolve()
        .then(getActiveTab)
        .then(activeTab => sendMessageToTab(messageObject, activeTab))
        .then(sendResponse)
        .catch(sendResponse)
      break
    default:
      sendResponse(new Error('InvalidMessageTypeError'))
  }
  // https://stackoverflow.com/a/71520230/18535330
  return true
}

type InitializeBackground = () => () => void

export const initializeBackground: InitializeBackground = () => {
  const runtimeOnMessage = chrome.runtime.onMessage
  runtimeOnMessage.addListener(handleMessage)
  return () => {
    runtimeOnMessage.removeListener(handleMessage)
  }
}
