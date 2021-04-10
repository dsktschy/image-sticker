import { DropMessageObject } from './DropMessageObject'

export interface StickerObject {
  height: number
  id: string
  position: {
    left: number
    top: number
  }
  src: string
  transform: {
    translate: [number, number]
  }
  width: number
}

type CreateStickerObject = (
  dropMessageObject: DropMessageObject
) => StickerObject

export const createStickerObject: CreateStickerObject = ({ payload }) => ({
  height: 0,
  id: payload.id,
  position: {
    left: 0,
    top: 0
  },
  src: payload.src,
  transform: {
    translate: [0, 0]
  },
  width: 0
})

type UpdateStickerObjectSize = (
  stickerObject: StickerObject,
  width: number,
  height: number
) => StickerObject

export const updateStickerObjectSize: UpdateStickerObjectSize = (
  stickerObject,
  width,
  height
) => ({
  ...stickerObject,
  width,
  height
})

type UpdateStickerObjectPosition = (
  stickerObject: StickerObject,
  clientWidth: number,
  clientHeight: number
) => StickerObject

export const updateStickerObjectPosition: UpdateStickerObjectPosition = (
  stickerObject,
  clientWidth,
  clientHeight
) => ({
  ...stickerObject,
  position: {
    top: clientHeight / 2 - stickerObject.height / 2,
    left: clientWidth / 2 - stickerObject.width / 2
  }
})

type UpdateStickerObjectTransform = (
  stickerObject: StickerObject,
  transform: {
    translate: [number, number]
  }
) => StickerObject

export const updateStickerObjectTransform: UpdateStickerObjectTransform = (
  stickerObject,
  { translate }
) => {
  const currentTranslate = stickerObject.transform.translate
  return {
    ...stickerObject,
    transform: {
      translate: [
        currentTranslate[0] + translate[0],
        currentTranslate[1] + translate[1]
      ]
    }
  }
}
