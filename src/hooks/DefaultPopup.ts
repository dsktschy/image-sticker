import {
  DropzoneInputProps,
  DropzoneRootProps,
  useDropzone
} from 'react-dropzone'
import { languages } from '../models/default_popup'
import { readFileList } from '../models/file_reader'
import { sendClickMessageToBackground } from '../models/message_sender'

type UseDefaultPopup = () => {
  getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps
  getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps
  languages: typeof languages
  sendClickMessageToBackground: typeof sendClickMessageToBackground
}

export const useDefaultPopup: UseDefaultPopup = () => {
  const { getInputProps, getRootProps } = useDropzone({
    accept: '.png,.jpg,.jpeg,.gif,.svg',
    noClick: true,
    noKeyboard: true,
    onDrop: readFileList
  })

  return {
    getInputProps,
    getRootProps,
    languages,
    sendClickMessageToBackground
  }
}
