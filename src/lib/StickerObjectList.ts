import { StickerObject } from './StickerObject'

export const addToStickerObjectList = (
  stickerObjectList: StickerObject[],
  stickerObject: StickerObject
): StickerObject[] => [...stickerObjectList, stickerObject]

export const removeFromStickerObjectList = (
  stickerObjectList: StickerObject[],
  stickerObject: StickerObject
): StickerObject[] =>
  stickerObjectList.filter(_stickerObject => _stickerObject !== stickerObject)
