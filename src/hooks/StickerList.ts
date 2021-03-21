import { useStickerListContext } from '../contexts/StickerList'
import { Sticker } from '../lib/Sticker'

type UseStickerList = () => {
  stickerList: Sticker[]
}

export const useStickerList: UseStickerList = () => {
  const [stickerList] = useStickerListContext()

  return {
    stickerList
  }
}
