import { createPopupClickedMessageObject } from '~/lib/PopupClickedMessageObject'
import { getActiveTab } from '~/models/tab_getter'
import { sendMessageToTab } from '~/models/message_sender'

type Languages = {
  [key: string]: string
}

export const languages: Languages = {
  textOnAvailablePage: chrome.i18n.getMessage(
    'defaultPopupTextOnAvailablePage'
  ),
  textOnNotAvailablePage: chrome.i18n.getMessage(
    'defaultPopupTextOnNotAvailablePage'
  )
}

export type HandleRecieveResponse = (result: boolean) => void

type SendPopupClickedMessageToBackground = (
  handleRecieveResponse: HandleRecieveResponse
) => void

export const sendPopupClickedMessageToBackground: SendPopupClickedMessageToBackground = handleRecieveResponse => {
  Promise.resolve()
    .then(getActiveTab)
    .then(activeTab =>
      sendMessageToTab(createPopupClickedMessageObject(), activeTab)
    )
    .then(handleRecieveResponse)
    .catch(() => {
      handleRecieveResponse(false)
    })
}

type ExecuteContentScript = (tab: chrome.tabs.Tab) => Promise<boolean>

const executeContentScript: ExecuteContentScript = async tab => {
  try {
    const tabId = tab.id
    if (typeof tabId === 'undefined') throw new Error('NoTabIdError')
    const [injectionResult] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => !!document.getElementById('imgstckr')
    })
    if (injectionResult.result) return true
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['/vendor.js', '/content_script.js']
    })
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
