import { MessageObject } from './MessageObject'

export interface StickerObject {
  id: number
  position: {
    top: number
    left: number
  }
  src: string
}

export const createStickerObject = (
  messageObject: MessageObject,
  document: Document
): StickerObject => ({
  ...messageObject,
  position: {
    top: document.documentElement.clientHeight / 2,
    left: document.documentElement.clientWidth / 2
  }
})

export const offsetStickerObjectPosition = (
  stickerObject: StickerObject,
  x: number,
  y: number
): StickerObject => {
  const offsetPosition = { ...stickerObject.position }
  offsetPosition.top += y
  offsetPosition.left += x
  return { ...stickerObject, position: offsetPosition }
}
