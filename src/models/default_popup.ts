import { CustomError } from '~/lib/CustomError'
import { createPopupClickedMessageObject } from '~/lib/PopupClickedMessageObject'
import { getActiveTab } from '~/models/tab_getter'
import { sendMessageToTab } from '~/models/message_sender'

type Languages = {
  [key: string]: string
}

export const languages: Languages = {
  textNoError: chrome.i18n.getMessage('defaultPopupTextNoError'),
  textUnavailablePageError: chrome.i18n.getMessage(
    'defaultPopupTextUnavailablePageError'
  )
}

type HandleReceiveResponse = (error: CustomError | null) => void

type SendPopupClickedMessageToContentScript = (
  handleReceiveResponse: HandleReceiveResponse
) => void

export const sendPopupClickedMessageToContentScript: SendPopupClickedMessageToContentScript = handleReceiveResponse => {
  Promise.resolve()
    .then(getActiveTab)
    .then(activeTab =>
      sendMessageToTab(createPopupClickedMessageObject(), activeTab)
    )
    .then(handleReceiveResponse)
    .catch(handleReceiveResponse)
}

type ExecuteContentScript = (
  tab: chrome.tabs.Tab
) => Promise<CustomError | null>

const executeContentScript: ExecuteContentScript = async tab => {
  const tabId = tab.id
  if (typeof tabId === 'undefined') return new CustomError('NoTabIdError')
  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => !!document.getElementById('imgstckr')
    })
    if (result) return null
  } catch (error) {
    // Distinguish between unavailable page error and other errors for test
    const message =
      error instanceof Error && error.message.startsWith('Cannot access')
        ? 'UnavailablePageError'
        : 'ExecuteContentScriptError'
    throw new CustomError(message)
  }
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ['/vendor.js', '/content_script.js']
  })
  return null
}

type InitializeDefaultPopup = (
  handleReceiveResponse: HandleReceiveResponse
) => () => void

export const initializeDefaultPopup: InitializeDefaultPopup = handleReceiveResponse => {
  Promise.resolve()
    .then(getActiveTab)
    .then(executeContentScript)
    .then(handleReceiveResponse)
    .catch(handleReceiveResponse)
  return () => {
    // No events to destroy
  }
}
