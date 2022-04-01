import { CustomError } from '~/lib/CustomError'
import { createPopupClickedMessageObject } from '~/lib/PopupClickedMessageObject'
import { getActiveTab } from '~/models/tab_getter'
import { sendMessageToTab } from '~/models/message_sender'

type Languages = {
  [key: string]: string
}

export const languages: Languages = {
  textNoError: chrome.i18n.getMessage('defaultPopupTextNoError'),
  textError: chrome.i18n.getMessage('defaultPopupTextError'),
  textUpdatingError: chrome.i18n.getMessage('defaultPopupTextUpdatingError'),
  textReopeningError: chrome.i18n.getMessage('defaultPopupTextReopeningError')
}

type HandleRecieveResponse = (error: CustomError | null) => void

type SendPopupClickedMessageToContentScript = (
  handleRecieveResponse: HandleRecieveResponse
) => void

export const sendPopupClickedMessageToContentScript: SendPopupClickedMessageToContentScript = handleRecieveResponse => {
  Promise.resolve()
    .then(getActiveTab)
    .then(activeTab =>
      sendMessageToTab(createPopupClickedMessageObject(), activeTab)
    )
    .then(handleRecieveResponse)
    .catch(handleRecieveResponse)
}

type ExecuteContentScript = (
  tab: chrome.tabs.Tab
) => Promise<CustomError | null>

const executeContentScript: ExecuteContentScript = async tab => {
  const tabId = tab.id
  if (typeof tabId === 'undefined')
    return new CustomError('NoTabIdError', false, true)
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => !!document.getElementById('imgstckr')
  })
  if (result) return null
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ['/vendor.js', '/content_script.js']
  })
  return null
}

type InitializeDefaultPopup = (
  handleRecieveResponse: HandleRecieveResponse
) => () => void

export const initializeDefaultPopup: InitializeDefaultPopup = handleRecieveResponse => {
  Promise.resolve()
    .then(getActiveTab)
    .then(executeContentScript)
    .then(handleRecieveResponse)
    .catch(handleRecieveResponse)
  return () => {
    // No events to destroy
  }
}
