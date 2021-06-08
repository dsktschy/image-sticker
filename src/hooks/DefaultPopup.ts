import { useCallback, useEffect, useState } from 'react'
import {
  DropzoneInputProps,
  DropzoneRootProps,
  useDropzone
} from 'react-dropzone'
import {
  HandleRecieveResponse,
  initializeDefaultPopup,
  languages,
  sendPopupClickedMessageToBackground
} from '~/models/default_popup'
import { readFileList } from '~/models/file_reader'

type UseDefaultPopup = () => {
  onAvailablePage: boolean
  getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps
  getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps
  languages: typeof languages
  ready: boolean
  openContentScriptFileDialog: () => void
}

export const useDefaultPopup: UseDefaultPopup = () => {
  const { getInputProps, getRootProps } = useDropzone({
    accept: '.png,.jpg,.jpeg,.gif,.svg',
    noClick: true,
    noKeyboard: true,
    onDrop: readFileList
  })

  const [ready, setReady] = useState(false)

  const [onAvailablePage, setOnAvailablePage] = useState(false)

  const noop = useCallback<HandleRecieveResponse>(() => {
    // No operation
  }, [])

  const openContentScriptFileDialog = useCallback(() => {
    sendPopupClickedMessageToBackground(noop)
  }, [noop])

  const updateState = useCallback<HandleRecieveResponse>(result => {
    setReady(true)
    setOnAvailablePage(result)
  }, [])

  useEffect(() => {
    return initializeDefaultPopup(updateState)
  }, [updateState])

  return {
    onAvailablePage,
    getInputProps,
    getRootProps,
    languages,
    ready,
    openContentScriptFileDialog
  }
}
