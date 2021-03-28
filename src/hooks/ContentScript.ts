import { useCallback, useEffect } from 'react'
import { useStickerObjectListContext } from '../contexts/StickerObjectList'
import {
  initializeContentScript,
  OnMessageCallback
} from '../models/ContentScript'

type UseContentScript = () => void

export const useContentScript: UseContentScript = () => {
  const [, stickerObjectListDispatch] = useStickerObjectListContext()

  const addStickerList = useCallback<OnMessageCallback>(
    stickerObject => {
      stickerObjectListDispatch({ type: 'add', payload: stickerObject })
    },
    [stickerObjectListDispatch]
  )

  useEffect(() => {
    return initializeContentScript(addStickerList)
  }, [addStickerList])
}
