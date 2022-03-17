import { browser, Tabs } from 'webextension-polyfill-ts'
import { MessageObject } from '~/lib/MessageObject'

type SendMessageToTab = (
  messageObject: MessageObject,
  tab: Tabs.Tab
) => Promise<boolean>

export const sendMessageToTab: SendMessageToTab = async (
  messageObject,
  tab
) => {
  if (typeof tab.id === 'undefined') throw new Error('NoTabIdError')
  const responsePromise = (await browser.tabs.sendMessage(
    tab.id,
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
