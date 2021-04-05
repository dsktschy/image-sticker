import { sendDropMessageToBackground } from './message_sender'

type CreateHandleLoad = (
  handleLoadCallback: () => void
) => (event: ProgressEvent<FileReader>) => void

const createHandleLoad: CreateHandleLoad = handleLoadCallback => ({
  target
}) => {
  if (target) {
    const { result } = target
    if (typeof result === 'string') sendDropMessageToBackground(result)
  }
  handleLoadCallback()
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
