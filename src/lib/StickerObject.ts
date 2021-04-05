import { DropMessageObject } from './DropMessageObject'

export interface StickerObject {
  id: string
  position: {
    top: number
    left: number
  }
  src: string
}

type CreateStickerObject = (
  dropMessageObject: DropMessageObject,
  document: Document
) => StickerObject

export const createStickerObject: CreateStickerObject = (
  { payload },
  document
) => ({
  id: payload.id,
  position: {
    top: document.documentElement.clientHeight / 2,
    left: document.documentElement.clientWidth / 2
  },
  src: payload.src
})

type OffsetStickerObjectPosition = (
  stickerObject: StickerObject,
  x: number,
  y: number
) => StickerObject

export const offsetStickerObjectPosition: OffsetStickerObjectPosition = (
  stickerObject,
  x,
  y
) => {
  const offsetPosition = { ...stickerObject.position }
  offsetPosition.top += y
  offsetPosition.left += x
  return { ...stickerObject, position: offsetPosition }
}
