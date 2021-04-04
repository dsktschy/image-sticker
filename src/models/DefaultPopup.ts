import { browser, Tabs } from 'webextension-polyfill-ts'
import { createMessageObject } from '../lib/MessageObject'

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

type TrySendingMessage = (event: ProgressEvent<FileReader>) => void

const trySendingMessage: TrySendingMessage = ({ target }) => {
  if (!target) return
  const { result } = target
  if (typeof result !== 'string') return
  sendMessage(result).catch(error => {
    throw error
  })
}

type CreateHandleLoad = (
  handleLoadCallback: () => void
) => (event: ProgressEvent<FileReader>) => void

const createHandleLoad: CreateHandleLoad = handleLoadCallback => event => {
  trySendingMessage(event)
  handleLoadCallback()
}

export type ReadFileList = (fileList: File[]) => void

export const readFileList: ReadFileList = fileList => {
  if (typeof FileReader === 'undefined') throw new Error('NoFileReaderError')
  for (const file of Array.from(fileList)) {
    // https://stackoverflow.com/questions/24843508/
    const fileReader = new FileReader()
    const handleLoad = createHandleLoad(() => {
      fileReader.removeEventListener('load', handleLoad)
    })
    fileReader.addEventListener('load', handleLoad)
    fileReader.readAsDataURL(file)
  }
}
