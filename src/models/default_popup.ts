import { browser, Tabs } from 'webextension-polyfill-ts'
import { createPopupClickedMessageObject } from '~/lib/PopupClickedMessageObject'
import { getActiveTab } from '~/models/tab_getter'
import { sendMessageToTab } from '~/models/message_sender'

type Languages = {
  [key: string]: string
}

export const languages: Languages = {
  textOnAvailablePage: browser.i18n.getMessage(
    'defaultPopupTextOnAvailablePage'
  ),
  textOnNotAvailablePage: browser.i18n.getMessage(
    'defaultPopupTextOnNotAvailablePage'
  )
}

export type HandleRecieveResponse = (result: boolean) => void

type SendPopupClickedMessageToBackground = (
  handleRecieveResponse: HandleRecieveResponse
) => void

export const sendPopupClickedMessageToBackground: SendPopupClickedMessageToBackground = handleRecieveResponse => {
  const popupClickedMessageObject = createPopupClickedMessageObject()
  Promise.resolve()
    .then(getActiveTab)
    .then(tab => sendMessageToTab(popupClickedMessageObject, tab))
    .then(handleRecieveResponse)
    .catch(() => {
      handleRecieveResponse(false)
    })
}

type ExecuteContentScript = (tab: Tabs.Tab) => Promise<boolean>

const executeContentScript: ExecuteContentScript = async tab => {
  try {
    const tabId = tab.id
    if (typeof tabId === 'undefined') throw new Error('NoTabIdError')
    const [contentScriptExecuted] = (await browser.tabs.executeScript(tabId, {
      code: '!!document.getElementById("imgstckr")'
    })) as [boolean]
    if (contentScriptExecuted) return true
    await browser.tabs.executeScript(tabId, { file: '/vendor.js' })
    await browser.tabs.executeScript(tabId, { file: '/content_script.js' })
    return true
  } catch (error) {
    return false
  }
}

type InitializeDefaultPopup = (
  handleRecieveResponse: HandleRecieveResponse
) => () => void

export const initializeDefaultPopup: InitializeDefaultPopup = handleRecieveResponse => {
  Promise.resolve()
    .then(getActiveTab)
    .then(executeContentScript)
    .then(handleRecieveResponse)
    .catch(() => {
      handleRecieveResponse(false)
    })
  return () => {
    // No events to destroy
  }
}
