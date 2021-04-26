import { ReactEventHandler, useCallback } from 'react'
import { useStickerObjectListContext } from '../contexts/StickerObjectList'
import { StickerObject } from '../lib/StickerObject'
import { cloneStickerObject } from '../models/content_script'

type UseEditButtonList = (props: {
  stickerObject: StickerObject
}) => {
  cloneStickerObject: ReactEventHandler<HTMLDivElement>
  removeStickerObject: ReactEventHandler<HTMLDivElement>
}

export const useEditButtonList: UseEditButtonList = ({ stickerObject }) => {
  const [, stickerObjectListDispatch] = useStickerObjectListContext()

  const _cloneStickerObject = useCallback<
    ReactEventHandler<HTMLDivElement>
  >(() => {
    const stickerObjectClone = cloneStickerObject(stickerObject)
    stickerObjectListDispatch({ type: 'ADD', payload: stickerObjectClone })
  }, [stickerObject, stickerObjectListDispatch])

  const removeStickerObject = useCallback<
    ReactEventHandler<HTMLDivElement>
  >(() => {
    stickerObjectListDispatch({ type: 'REMOVE', payload: stickerObject })
  }, [stickerObject, stickerObjectListDispatch])

  return {
    cloneStickerObject: _cloneStickerObject,
    removeStickerObject
  }
}
