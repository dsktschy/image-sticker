import { ReactEventHandler, useCallback } from 'react'
import { useStickerObjectListContext } from '../contexts/StickerObjectList'
import { StickerObject } from '../lib/StickerObject'
import { cloneStickerObject } from '../models/content_script'

type UseEditButtonList = (props: {
  stickerObject: StickerObject
}) => {
  cloneStickerObject: ReactEventHandler<HTMLButtonElement>
  removeStickerObject: ReactEventHandler<HTMLButtonElement>
}

export const useEditButtonList: UseEditButtonList = ({ stickerObject }) => {
  const [, stickerObjectListDispatch] = useStickerObjectListContext()

  const _cloneStickerObject = useCallback<
    ReactEventHandler<HTMLButtonElement>
  >(() => {
    const stickerObjectClone = cloneStickerObject(stickerObject)
    stickerObjectListDispatch({ type: 'add', payload: stickerObjectClone })
  }, [stickerObject, stickerObjectListDispatch])

  const removeStickerObject = useCallback<
    ReactEventHandler<HTMLButtonElement>
  >(() => {
    stickerObjectListDispatch({ type: 'remove', payload: stickerObject })
  }, [stickerObject, stickerObjectListDispatch])

  return {
    cloneStickerObject: _cloneStickerObject,
    removeStickerObject
  }
}
