import { CustomError } from '~/lib/CustomError'
import { MessageObject } from '~/lib/MessageObject'

type TabsSendMessage = <M, R>(tabId: number, messageObject: M) => Promise<R>

const tabsSendMessage: TabsSendMessage = (tabId, messageObject) =>
  new Promise(resolve => {
    chrome.tabs.sendMessage(tabId, messageObject, resolve)
  })

type SendMessageToTab = (
  messageObject: MessageObject,
  tab: chrome.tabs.Tab
) => Promise<CustomError | null>

export const sendMessageToTab: SendMessageToTab = async (
  messageObject,
  tab
) => {
  if (typeof tab.id === 'undefined')
    return new CustomError('NoTabIdError', false, true)
  const error = await tabsSendMessage<MessageObject, CustomError | null>(
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
) => Promise<CustomError | null>

export const sendMessageToBackground: SendMessageToBackground = async messageObject => {
  const error = await runtimeSendMessage<MessageObject, CustomError | null>(
    messageObject
  )
  return error
}
