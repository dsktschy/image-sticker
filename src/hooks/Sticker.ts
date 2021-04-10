import {
  ReactEventHandler,
  RefObject,
  useCallback,
  useRef,
  useState
} from 'react'
import { OnDrag, OnDragEnd, OnDragStart } from 'react-moveable'
import {
  updateStickerObjectSize,
  updateStickerObjectPosition,
  updateStickerObjectTransform,
  StickerObject
} from '../lib/StickerObject'

type UseSticker = (props: {
  activateCallback: (stickerObject: StickerObject) => void
  resetTransformCallback: (stickerObject: StickerObject) => void
  stickerObject: StickerObject
}) => {
  activate: ReactEventHandler<HTMLImageElement>
  activated: boolean
  resetTransform: (event: OnDragEnd) => void
  setCurrentTranslate: (event: OnDrag) => void
  setStartTranslate: (event: OnDragStart) => void
  src: string
  targetRef: RefObject<HTMLImageElement>
}

type Transform = {
  translate: [number, number]
}

export const useSticker: UseSticker = ({
  activateCallback,
  resetTransformCallback,
  stickerObject
}) => {
  const targetRef = useRef<HTMLImageElement>(null)

  const [transform] = useState<Transform>({
    translate: [0, 0]
  })

  const [activated, setActivated] = useState(false)

  const activate = useCallback<ReactEventHandler<HTMLImageElement>>(
    ({ currentTarget }) => {
      const { naturalWidth, naturalHeight, ownerDocument } = currentTarget
      const sizeUpdatedStickerObject = updateStickerObjectSize(
        stickerObject,
        naturalWidth,
        naturalHeight
      )
      const { documentElement } = ownerDocument
      const { clientWidth, clientHeight } = documentElement
      const positionUpdatedStickerObject = updateStickerObjectPosition(
        sizeUpdatedStickerObject,
        clientWidth,
        clientHeight
      )
      setActivated(true)
      activateCallback(positionUpdatedStickerObject)
    },
    [activateCallback, stickerObject]
  )

  const setStartTranslate = useCallback<(event: OnDragStart) => void>(
    ({ set }) => {
      set(transform.translate)
    },
    [transform]
  )

  const setCurrentTranslate = useCallback<(event: OnDrag) => void>(
    ({ target, beforeTranslate }) => {
      const [x, y] = beforeTranslate
      transform.translate = [x, y]
      target.style.transform = `translate(${x}px, ${y}px)`
    },
    [transform]
  )

  const resetTransform = useCallback<(event: OnDragEnd) => void>(
    ({ target }) => {
      const updatedSticker = updateStickerObjectTransform(
        stickerObject,
        transform
      )
      transform.translate = [0, 0]
      target.style.transform = `translate(${0}px, ${0}px)`
      resetTransformCallback(updatedSticker)
    },
    [stickerObject, transform, resetTransformCallback]
  )

  return {
    activate,
    activated,
    resetTransform,
    setCurrentTranslate,
    setStartTranslate,
    src: stickerObject.src,
    targetRef
  }
}
