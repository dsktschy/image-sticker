import { MessageObject } from '~/lib/MessageObject'

type TabsSendMessage = <M, R>(tabId: number, messageObject: M) => Promise<R>

const tabsSendMessage: TabsSendMessage = (tabId, messageObject) =>
  new Promise(resolve => {
    chrome.tabs.sendMessage(tabId, messageObject, resolve)
  })

type SendMessageToTab = (
  messageObject: MessageObject,
  tab: chrome.tabs.Tab
) => Promise<boolean>

export const sendMessageToTab: SendMessageToTab = async (
  messageObject,
  tab
) => {
  if (typeof tab.id === 'undefined') throw new Error('NoTabIdError')
  const response = await tabsSendMessage<MessageObject, boolean>(
    tab.id,
    messageObject
  )
  return response
}

type RuntimeSendMessage = <M, R>(messageObject: M) => Promise<R>

const runtimeSendMessage: RuntimeSendMessage = messageObject =>
  new Promise(resolve => {
    chrome.runtime.sendMessage(messageObject, resolve)
  })

type SendMessageToBackground = (
  messageObject: MessageObject
) => Promise<boolean>

export const sendMessageToBackground: SendMessageToBackground = async messageObject => {
  const response = await runtimeSendMessage<MessageObject, boolean>(
    messageObject
  )
  return response
}
