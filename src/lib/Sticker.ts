import { Message } from './Message'

export interface Sticker {
  id: number
  position: {
    top: number
    left: number
  }
  src: string
}

export const createSticker = (
  message: Message,
  document: Document
): Sticker => ({
  ...message,
  position: {
    top: document.documentElement.clientHeight / 2,
    left: document.documentElement.clientWidth / 2
  }
})
