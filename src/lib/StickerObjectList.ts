import { StickerObject } from './StickerObject'

type AddToStickerObjectList = (
  stickerObjectList: StickerObject[],
  stickerObject: StickerObject
) => StickerObject[]

export const addToStickerObjectList: AddToStickerObjectList = (
  stickerObjectList,
  stickerObject
) => [...stickerObjectList, stickerObject]

type RemoveFromStickerObjectList = (
  stickerObjectList: StickerObject[],
  stickerObject: StickerObject
) => StickerObject[]

export const removeFromStickerObjectList: RemoveFromStickerObjectList = (
  stickerObjectList,
  stickerObject
) =>
  stickerObjectList.filter(
    _stickerObject => _stickerObject.id !== stickerObject.id
  )

type UpdateInStickerObjectList = (
  stickerObjectList: StickerObject[],
  stickerObject: StickerObject
) => StickerObject[]

export const updateInStickerObjectList: UpdateInStickerObjectList = (
  stickerObjectList,
  stickerObject
) => {
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
