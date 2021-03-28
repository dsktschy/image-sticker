import { browser, Tabs } from 'webextension-polyfill-ts'
import { createMessageObject } from '../lib/MessageObject'

let fileReader: FileReader | null = null

type SendMessage = (result: string) => Promise<void>

const sendMessage: SendMessage = async result => {
  let tabList: Tabs.Tab[] = []
  try {
    tabList = await browser.tabs.query({
      active: true,
      currentWindow: true
    })
  } catch (error) {
    throw new Error('TabsQueryingError')
  }
  const messageObject = createMessageObject(result)
  for (const tab of tabList) {
    if (typeof tab.id !== 'number') continue
    try {
      await browser.tabs.sendMessage(tab.id, messageObject)
    } catch (error) {
      throw new Error('MessageSendingError')
    }
  }
}

type TrySendingMessage = (event: { target: FileReader | null }) => void

const trySendingMessage: TrySendingMessage = ({ target }) => {
  if (!target) return
  const { result } = target
  if (typeof result !== 'string') return
  sendMessage(result).catch(error => {
    throw error
  })
}

type InitializeDefaultPopup = () => () => void

export const initializeDefaultPopup: InitializeDefaultPopup = () => {
  if (typeof FileReader === 'undefined') throw new Error('NoFileReaderError')
  fileReader = new FileReader()
  fileReader.addEventListener('load', trySendingMessage)
  return () => {
    if (!fileReader) return
    fileReader.removeEventListener('load', trySendingMessage)
  }
}

export type ReadFileList = (event: {
  currentTarget: EventTarget & HTMLInputElement
}) => void

export const readFileList: ReadFileList = ({ currentTarget }) => {
  if (!fileReader) return
  const fileList = currentTarget.files
  if (!fileList) return
  Array.from(fileList).forEach(fileReader.readAsDataURL.bind(fileReader))
}
