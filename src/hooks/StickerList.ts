import { useCallback } from 'react'
import { useStickerObjectListContext } from '../contexts/StickerObjectList'
import { StickerObject } from '../lib/StickerObject'

type UseStickerList = () => {
  stickerObjectList: StickerObject[]
  updateStickerObject: (stickerObject: StickerObject) => void
}

export const useStickerList: UseStickerList = () => {
  const [
    stickerObjectList,
    stickerObjectListDispatch
  ] = useStickerObjectListContext()

  const updateStickerObject = useCallback<
    (stickerObject: StickerObject) => void
  >(
    stickerObject => {
      stickerObjectListDispatch({ type: 'update', payload: stickerObject })
    },
    [stickerObjectListDispatch]
  )

  return {
    stickerObjectList,
    updateStickerObject
  }
}
