import { browser } from 'webextension-polyfill-ts'
import { MessageObject } from '~/lib/MessageObject'
import { sendMessageToTab } from '~/models/message_sender'

type GetActiveTabId = () => Promise<number>

const getActiveTabId: GetActiveTabId = async () => {
  const tabList = await browser.tabs.query({
    active: true,
    currentWindow: true
  })
  let tabId = -1
  for (const tab of tabList) {
    if (typeof tab.id === 'number') tabId = tab.id
  }
  if (tabId === -1) throw new Error('NoActiveTab')
  return tabId
}

// ToDo
// if (!executedTabIdList.includes(tabId) && contentScriptExecuted)
//   /* Show the 'Please reload' message */

type ExecuteContentScript = (tabId: number) => Promise<boolean>

const executeContentScript: ExecuteContentScript = async tabId => {
  try {
    const [contentScriptExecuted] = (await browser.tabs.executeScript(tabId, {
      code: '!!document.getElementById("imgstckr")'
    })) as [boolean]
    if (contentScriptExecuted) return true
    await browser.tabs.executeScript(tabId, {
      file: '/content_script.js'
    })
    return true
  } catch (error) {
    return false
  }
}

type HandleMessage = (messageObject: MessageObject) => Promise<boolean>

const handleMessage: HandleMessage = messageObject =>
  Promise.resolve()
    .then(getActiveTabId)
    .then(tabId => {
      switch (messageObject.type) {
        case 'popupOpened':
          return executeContentScript(tabId)
        case 'popupClicked':
        case 'droppedOnPopup':
          return sendMessageToTab(messageObject, tabId)
        default:
          throw new Error('InvalidMessageTypeError')
      }
    })
    .catch(error => {
      throw error
    })

type InitializeBackground = () => () => void

export const initializeBackground: InitializeBackground = () => {
  const runtimeOnMessage = browser.runtime.onMessage
  runtimeOnMessage.addListener(handleMessage)
  return () => {
    runtimeOnMessage.removeListener(handleMessage)
  }
}
