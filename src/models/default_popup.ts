import { browser } from 'webextension-polyfill-ts'

type Languages = {
  [key: string]: string
}

export const languages: Languages = {
  dropImagesHere: browser.i18n.getMessage('defaultPopupDropImagesHere'),
  or: browser.i18n.getMessage('defaultPopupOr'),
  clickToSelectImages: browser.i18n.getMessage(
    'defaultPopupClickToSelectImages'
  )
}
