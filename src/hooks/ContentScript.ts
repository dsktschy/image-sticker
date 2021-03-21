import { useCallback, useEffect } from 'react'
import { useStickerListContext } from '../contexts/StickerList'
import { initializeContentScript, OnMessage } from '../models/ContentScript'

type UseContentScript = () => void

export const useContentScript: UseContentScript = () => {
  const [, stickerListDispatch] = useStickerListContext()

  const addStickerList = useCallback<OnMessage>(
    ({ stickerList }) => {
      stickerListDispatch({ type: 'add', payload: { stickerList } })
    },
    [stickerListDispatch]
  )

  useEffect(() => {
    return initializeContentScript({ onMessage: addStickerList })
  }, [addStickerList])
}
