import { browser } from 'webextension-polyfill-ts'
import { MessageObject } from '~/lib/MessageObject'

type SendMessageToTab = (
  messageObject: MessageObject,
  tabId: number
) => Promise<boolean>

export const sendMessageToTab: SendMessageToTab = async (
  messageObject,
  tabId
) => {
  const responsePromise = (await browser.tabs.sendMessage(
    tabId,
    messageObject
  )) as Promise<boolean>
  const response = await responsePromise
  return response
}

type SendMessageToBackground = (
  messageObject: MessageObject
) => Promise<boolean>

export const sendMessageToBackground: SendMessageToBackground = async messageObject => {
  const responsePromise = (await browser.runtime.sendMessage(
    messageObject
  )) as Promise<boolean>
  const response = await responsePromise
  return response
}
