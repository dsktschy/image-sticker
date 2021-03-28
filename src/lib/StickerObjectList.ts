import { StickerObject } from './StickerObject'

export const addStickerObjectList = (
  addedStickerObjectList: StickerObject[],
  stickerObjectList: StickerObject[]
): StickerObject[] => [...stickerObjectList, ...addedStickerObjectList]

export const removeStickerObjectList = (
  removedStickerObjectList: StickerObject[],
  stickerObjectList: StickerObject[]
): StickerObject[] =>
  stickerObjectList.filter(
    stickerObject => !removedStickerObjectList.includes(stickerObject)
  )
