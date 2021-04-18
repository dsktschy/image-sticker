import { ReactEventHandler, useCallback } from 'react'
import { useStickerObjectListContext } from '../contexts/StickerObjectList'
import { StickerObject } from '../lib/StickerObject'

type UseRemoveButton = (props: {
  stickerObject: StickerObject
}) => {
  removeStickerObject: ReactEventHandler<HTMLButtonElement>
}

export const useRemoveButton: UseRemoveButton = ({ stickerObject }) => {
  const [, stickerObjectListDispatch] = useStickerObjectListContext()

  const removeStickerObject = useCallback<
    ReactEventHandler<HTMLButtonElement>
  >(() => {
    stickerObjectListDispatch({ type: 'remove', payload: stickerObject })
  }, [stickerObject, stickerObjectListDispatch])

  return {
    removeStickerObject
  }
}
