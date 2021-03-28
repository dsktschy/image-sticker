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

export const updateInStickerObjectList = (
  stickerObjectList: StickerObject[],
  stickerObject: StickerObject
): StickerObject[] => {
  const updatedStickerObjectList = [...stickerObjectList]
  const targetStickerObject = stickerObjectList.find(
    _stickerObject => _stickerObject.id === stickerObject.id
  )
  if (targetStickerObject) {
    const index = stickerObjectList.indexOf(targetStickerObject)
    if (index >= 0) updatedStickerObjectList[index] = stickerObject
  }
  return updatedStickerObjectList
}
