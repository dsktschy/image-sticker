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

type BringToFrontOfStickerObjectList = (
  stickerObjectList: StickerObject[],
  stickerObject: StickerObject
) => StickerObject[]

export const bringToFrontOfStickerObjectList: BringToFrontOfStickerObjectList = (
  stickerObjectList,
  stickerObject
) =>
  addToStickerObjectList(
    removeFromStickerObjectList(stickerObjectList, stickerObject),
    stickerObject
  )
