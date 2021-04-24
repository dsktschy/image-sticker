import { nanoid } from 'nanoid'

export interface StickerObject {
  id: string
  src: string
}

type CreateStickerObject = (src: string) => StickerObject

export const createStickerObject: CreateStickerObject = src => ({
  id: nanoid(),
  src
})
