import { useCallback, useEffect } from 'react'
import { useStickerObjectListContext } from '../contexts/StickerObjectList'
import { initializeContentScript, OnMessage } from '../models/ContentScript'

type UseContentScript = () => void

export const useContentScript: UseContentScript = () => {
  const [, stickerObjectListDispatch] = useStickerObjectListContext()

  const addStickerList = useCallback<OnMessage>(
    ({ stickerObjectList }) => {
      stickerObjectListDispatch({ type: 'add', payload: { stickerObjectList } })
    },
    [stickerObjectListDispatch]
  )

  useEffect(() => {
    return initializeContentScript({ onMessage: addStickerList })
  }, [addStickerList])
}
