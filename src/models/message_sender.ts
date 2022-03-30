import { MessageObject } from '~/lib/MessageObject'

type TabsSendMessage = <M, R>(tabId: number, messageObject: M) => Promise<R>

const tabsSendMessage: TabsSendMessage = (tabId, messageObject) =>
  new Promise(resolve => {
    chrome.tabs.sendMessage(tabId, messageObject, resolve)
  })

type SendMessageToTab = (
  messageObject: MessageObject,
  tab: chrome.tabs.Tab
) => Promise<Error | null>

export const sendMessageToTab: SendMessageToTab = async (
  messageObject,
  tab
) => {
  if (typeof tab.id === 'undefined') return new Error('NoTabIdError')
  const error = await tabsSendMessage<MessageObject, Error | null>(
    tab.id,
    messageObject
  )
  return error
}

type RuntimeSendMessage = <M, R>(messageObject: M) => Promise<R>

const runtimeSendMessage: RuntimeSendMessage = messageObject =>
  new Promise(resolve => {
    chrome.runtime.sendMessage(messageObject, resolve)
  })

type SendMessageToBackground = (
  messageObject: MessageObject
) => Promise<Error | null>

export const sendMessageToBackground: SendMessageToBackground = async messageObject => {
  const error = await runtimeSendMessage<MessageObject, Error | null>(
    messageObject
  )
  return error
}
