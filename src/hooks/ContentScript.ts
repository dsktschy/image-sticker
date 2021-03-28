import { useCallback, useEffect } from 'react'
import { useStickerObjectListContext } from '../contexts/StickerObjectList'
import {
  initializeContentScript,
  HandleMessageCallback
} from '../models/ContentScript'

type UseContentScript = () => void

export const useContentScript: UseContentScript = () => {
  const [, stickerObjectListDispatch] = useStickerObjectListContext()

  const addStickerObject = useCallback<HandleMessageCallback>(
    stickerObject => {
      stickerObjectListDispatch({ type: 'add', payload: stickerObject })
    },
    [stickerObjectListDispatch]
  )

  useEffect(() => {
    return initializeContentScript(addStickerObject)
  }, [addStickerObject])
}
