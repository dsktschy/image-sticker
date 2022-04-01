import { useCallback, useEffect, useState } from 'react'
import {
  DropzoneInputProps,
  DropzoneRootProps,
  useDropzone
} from 'react-dropzone'
import {
  initializeDefaultPopup,
  languages,
  sendPopupClickedMessageToContentScript
} from '~/models/default_popup'
import { HandleLoadCallback, readFileList } from '~/models/file_reader'

type UseDefaultPopup = () => {
  getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps
  getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps
  onAvailablePage: boolean
  openContentScriptFileDialog: () => void
  ready: boolean
  text: string
}

export const useDefaultPopup: UseDefaultPopup = () => {
  const [ready, setReady] = useState(false)

  const [onAvailablePage, setOnAvailablePage] = useState(false)

  const [text, setText] = useState('')

  const updateState = useCallback<HandleLoadCallback>(error => {
    setReady(true)
    setOnAvailablePage(!error?.reopening)
    if (!error) setText(languages['textNoError'])
    else if (error.updating) setText(languages['textUpdatingError'])
    else if (error.reopening) setText(languages['textReopeningError'])
    else setText(languages['textError'])
  }, [])

  const { getInputProps, getRootProps } = useDropzone({
    accept: '.png,.jpg,.jpeg,.gif,.svg',
    noClick: true,
    noKeyboard: true,
    onDrop: readFileList.bind(null, updateState)
  })

  const openContentScriptFileDialog = useCallback(() => {
    sendPopupClickedMessageToContentScript(updateState)
  }, [updateState])

  useEffect(() => {
    return initializeDefaultPopup(updateState)
  }, [updateState])

  return {
    getInputProps,
    getRootProps,
    onAvailablePage,
    openContentScriptFileDialog,
    ready,
    text
  }
}
