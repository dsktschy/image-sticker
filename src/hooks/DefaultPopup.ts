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
import { noop } from '~/models/noop'

type UseDefaultPopup = () => {
  getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps
  getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps
  tryOpeningContentScriptFileDialog: () => void
  ready: boolean
  text: string
}

export const useDefaultPopup: UseDefaultPopup = () => {
  const [ready, setReady] = useState(false)

  const [onUnavailablePage, setOnUnavailablePage] = useState(false)

  const [text, setText] = useState('')

  const updateState = useCallback<HandleLoadCallback>(error => {
    // Error received from sendMessage is not instance of Error
    // Make sure that error is Error instance to make error message in console prettier
    if (error) console.error(new Error(error.message))
    setReady(true)
    const unavailablePageError = error?.message === 'UnavailablePageError'
    setOnUnavailablePage(unavailablePageError)
    let languageKey = 'textNoError'
    if (unavailablePageError) languageKey = 'textUnavailablePageError'
    // Todo: Show message for NoActiveTabError on droppedOnPopup event
    // It is occurred by developer tool of default_popup
    setText(languages[languageKey])
  }, [])

  const { getInputProps, getRootProps } = useDropzone({
    accept: '.png,.jpg,.jpeg,.gif,.svg',
    noClick: true,
    noKeyboard: true,
    onDrop: onUnavailablePage ? noop : readFileList.bind(null, updateState)
  })

  const tryOpeningContentScriptFileDialog = useCallback(() => {
    if (onUnavailablePage) return
    sendPopupClickedMessageToContentScript(updateState)
  }, [onUnavailablePage, updateState])

  useEffect(() => {
    return initializeDefaultPopup(updateState)
  }, [updateState])

  return {
    getInputProps,
    getRootProps,
    tryOpeningContentScriptFileDialog,
    ready,
    text
  }
}
