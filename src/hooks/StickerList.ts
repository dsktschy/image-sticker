import { useStickerObjectListContext } from '~/contexts/StickerObjectList'
import { StickerObject } from '~/lib/StickerObject'

type UseStickerList = () => {
  stickerObjectList: StickerObject[]
}

export const useStickerList: UseStickerList = () => {
  const [stickerObjectList] = useStickerObjectListContext()

  return {
    stickerObjectList
  }
}
