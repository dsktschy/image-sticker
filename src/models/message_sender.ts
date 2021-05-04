import { browser, Tabs } from 'webextension-polyfill-ts'
import {
  ClickMessageObject,
  createClickMessageObject
} from '~/lib/ClickMessageObject'
import {
  DropMessageObject,
  createDropMessageObject
} from '~/lib/DropMessageObject'

type SendMessageToActiveTabInCurrentWindow = (
  messageObject: ClickMessageObject | DropMessageObject
) => Promise<void>

export const sendMessageToActiveTabInCurrentWindow: SendMessageToActiveTabInCurrentWindow = async messageObject => {
  let tabList: Tabs.Tab[] = []
  tabList = await browser.tabs.query({
    active: true,
    currentWindow: true
  })
  for (const tab of tabList) {
    if (typeof tab.id !== 'number') continue
    await browser.tabs.sendMessage(tab.id, messageObject)
  }
}

type SendMessageToBackground = (
  messageObject: ClickMessageObject | DropMessageObject
) => Promise<void>

const sendMessageToBackground: SendMessageToBackground = async messageObject => {
  await browser.runtime.sendMessage(messageObject)
}

type SendClickMessageToBackground = () => void

export const sendClickMessageToBackground: SendClickMessageToBackground = () => {
  const clickMessageObject = createClickMessageObject()
  sendMessageToBackground(clickMessageObject).catch(error => {
    throw error
  })
}

type SendDropMessageToBackground = (src: string) => void

export const sendDropMessageToBackground: SendDropMessageToBackground = src => {
  const dropMessageObject = createDropMessageObject(src)
  sendMessageToBackground(dropMessageObject).catch(error => {
    throw error
  })
}
