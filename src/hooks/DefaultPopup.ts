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
  tryOpeningContentScriptFileDialog: () => void
  ready: boolean
  text: string
}

export const useDefaultPopup: UseDefaultPopup = () => {
  const [ready, setReady] = useState(false)

  const [onAvailablePage, setOnAvailablePage] = useState(false)

  const [text, setText] = useState('')

  const updateState = useCallback<HandleLoadCallback>(error => {
    if (error) console.error(error)
    setReady(true)
    const notAvailablePageError = error?.name === 'NotAvailablePageError'
    setOnAvailablePage(!notAvailablePageError)
    let languageKey = 'textNoError'
    if (notAvailablePageError) languageKey = 'textNotAvailablePageError'
    // Todo: Show message for NoActiveTabError on droppedOnPopup event
    // It is occured by developer tool of default_popup
    setText(languages[languageKey])
  }, [])

  const { getInputProps, getRootProps } = useDropzone({
    accept: '.png,.jpg,.jpeg,.gif,.svg',
    noClick: true,
    noKeyboard: true,
    onDrop: readFileList.bind(null, updateState)
  })

  const tryOpeningContentScriptFileDialog = useCallback(() => {
    if (!onAvailablePage) return
    sendPopupClickedMessageToContentScript(updateState)
  }, [onAvailablePage, updateState])

  useEffect(() => {
    return initializeDefaultPopup(updateState)
  }, [updateState])

  return {
    getInputProps,
    getRootProps,
    onAvailablePage,
    tryOpeningContentScriptFileDialog,
    ready,
    text
  }
}
