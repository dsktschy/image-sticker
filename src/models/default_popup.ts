import { browser } from 'webextension-polyfill-ts'
import { createPopupClickedMessageObject } from '~/lib/PopupClickedMessageObject'
import { createPopupOpenedMessageObject } from '~/lib/PopupOpenedMessageObject'
import { sendMessageToBackground } from '~/models/message_sender'

type Languages = {
  [key: string]: string
}

export const languages: Languages = {
  textOnAvailablePage: browser.i18n.getMessage(
    'defaultPopupTextOnAvailablePage'
  ),
  textOnNotAvailablePage: browser.i18n.getMessage(
    'defaultPopupTextOnNotAvailablePage'
  )
}

export type HandleRecieveResponse = (result: boolean) => void

type SendPopupClickedMessageToBackground = (
  handleRecieveResponse: HandleRecieveResponse
) => void

export const sendPopupClickedMessageToBackground: SendPopupClickedMessageToBackground = handleRecieveResponse => {
  const popupClickedMessageObject = createPopupClickedMessageObject()
  sendMessageToBackground(popupClickedMessageObject)
    .then(handleRecieveResponse)
    .catch(() => {
      // Error is thrown on background
    })
}

type InitializeDefaultPopup = (
  handleRecieveResponse: HandleRecieveResponse
) => () => void

export const initializeDefaultPopup: InitializeDefaultPopup = handleRecieveResponse => {
  const popupOpenedMessageObject = createPopupOpenedMessageObject()
  sendMessageToBackground(popupOpenedMessageObject)
    .then(handleRecieveResponse)
    .catch(() => {
      handleRecieveResponse(false)
    })
  return () => {
    // No events to destroy
  }
}
