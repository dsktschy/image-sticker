import { createDroppedOnPopupMessageObject } from '~/lib/DroppedOnPopupMessageObject'
import { sendMessageToBackground } from '~/models/message_sender'

type CreateHandleLoad = (
  handleLoadCallback: () => void
) => (event: ProgressEvent<FileReader>) => void

const createHandleLoad: CreateHandleLoad = handleLoadCallback => ({
  target
}) => {
  if (!target) throw new Error('FileLoadingError')
  const { result } = target
  if (typeof result !== 'string') throw new Error('FileDataURLError')
  const droppedOnPopupMessageObject = createDroppedOnPopupMessageObject(result)
  sendMessageToBackground(droppedOnPopupMessageObject)
    .then(handleLoadCallback)
    .catch(error => {
      throw error
    })
}

type ReadFileList = (fileList: File[]) => void

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
