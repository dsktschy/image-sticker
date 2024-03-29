import { CustomError } from '~/lib/CustomError'
import { createDroppedOnPopupMessageObject } from '~/lib/DroppedOnPopupMessageObject'
import { sendMessageToBackground } from '~/models/message_sender'

export type HandleLoadCallback = (error: CustomError | null) => void

type CreateHandleLoad = (
  handleLoadCallback: HandleLoadCallback
) => (event: ProgressEvent<FileReader>) => void

const createHandleLoad: CreateHandleLoad = handleLoadCallback => ({
  target
}) => {
  if (!target) {
    handleLoadCallback(new CustomError('FileLoadingError'))
    return
  }
  const { result } = target
  if (typeof result !== 'string') {
    handleLoadCallback(new CustomError('FileDataURLError'))
    return
  }
  const droppedOnPopupMessageObject = createDroppedOnPopupMessageObject(result)
  Promise.resolve()
    .then(() => sendMessageToBackground(droppedOnPopupMessageObject))
    .then(handleLoadCallback)
    .catch(handleLoadCallback)
}

type ReadFileList = (
  handleLoadCallback: HandleLoadCallback,
  fileList: File[]
) => void

export const readFileList: ReadFileList = (handleLoadCallback, fileList) => {
  if (typeof FileReader === 'undefined')
    handleLoadCallback(new CustomError('NoFileReaderError'))
  for (const file of Array.from(fileList)) {
    // https://stackoverflow.com/questions/24843508/
    const fileReader = new FileReader()
    const handleLoad = createHandleLoad(error => {
      fileReader.removeEventListener('load', handleLoad)
      handleLoadCallback(error)
    })
    fileReader.addEventListener('load', handleLoad)
    fileReader.readAsDataURL(file)
  }
}
