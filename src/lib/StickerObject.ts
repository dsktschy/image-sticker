import { DropMessageObject } from './DropMessageObject'

export interface StickerObject {
  id: string
  src: string
}

type CreateStickerObject = (
  dropMessageObject: DropMessageObject
) => StickerObject

export const createStickerObject: CreateStickerObject = ({ payload }) => ({
  id: payload.id,
  src: payload.src
})
