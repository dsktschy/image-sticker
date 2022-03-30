import { useCallback, useEffect } from 'react'
import {
  DropzoneInputProps,
  DropzoneRootProps,
  useDropzone
} from 'react-dropzone'
import { useStickerObjectListContext } from '~/contexts/StickerObjectList'
import {
  initializeContentScript,
  HandleDroppedOnPopupMessageCallback
} from '~/models/content_script'
import { readFileList } from '~/models/file_reader'
import { noop } from '~/models/noop'

type UseContentScript = () => {
  getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps
  getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps
}

export const useContentScript: UseContentScript = () => {
  const [, stickerObjectListDispatch] = useStickerObjectListContext()

  const { getInputProps, getRootProps, open } = useDropzone({
    accept: '.png,.jpg,.jpeg,.gif,.svg',
    noClick: true,
    noDrag: true,
    noKeyboard: true,
    onDrop: readFileList.bind(null, noop)
  })

  const addStickerObject = useCallback<HandleDroppedOnPopupMessageCallback>(
    stickerObject => {
      stickerObjectListDispatch({ type: 'ADD', payload: stickerObject })
    },
    [stickerObjectListDispatch]
  )

  useEffect(() => {
    return initializeContentScript(open, noop, addStickerObject)
  }, [addStickerObject, open])

  return {
    getInputProps,
    getRootProps
  }
}
