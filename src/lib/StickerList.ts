import { Sticker } from './Sticker'

export const addStickerList = (
  addedStickerList: Sticker[],
  stickerList: Sticker[]
): Sticker[] => [...stickerList, ...addedStickerList]

export const removeStickerList = (
  removedStickerList: Sticker[],
  stickerList: Sticker[]
): Sticker[] =>
  stickerList.filter(sticker => !removedStickerList.includes(sticker))
