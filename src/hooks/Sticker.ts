import {
  ReactEventHandler,
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react'
import { OnDrag, OnDragEnd, OnDragStart } from 'react-moveable'
import {
  offsetStickerObjectPosition,
  StickerObject
} from '../lib/StickerObject'

type UseSticker = (props: {
  offsetPositionCallback: (stickerObject: StickerObject) => void
  stickerObject: StickerObject
}) => {
  height: number
  offsetPosition: (event: OnDragEnd) => void
  setCurrentTranslate: (event: OnDrag) => void
  setSize: ReactEventHandler<HTMLImageElement>
  setStartTranslate: (event: OnDragStart) => void
  sized: boolean
  src: string
  targetRef: RefObject<HTMLImageElement>
  width: number
}

type Transform = {
  translate: [number, number]
}

export const useSticker: UseSticker = ({
  offsetPositionCallback,
  stickerObject
}) => {
  const targetRef = useRef<HTMLImageElement>(null)

  const [width, setWidth] = useState(0)

  const [height, setHeight] = useState(0)

  const [transform] = useState<Transform>({ translate: [0, 0] })

  const setSize = useCallback<ReactEventHandler<HTMLImageElement>>(
    ({ currentTarget }) => {
      const { naturalWidth, naturalHeight } = currentTarget
      setWidth(naturalWidth)
      setHeight(naturalHeight)
    },
    []
  )

  const sized = useMemo(() => !!width && !!height, [width, height])

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

  const offsetPosition = useCallback<(event: OnDragEnd) => void>(
    ({ target }) => {
      const offsetSticker = offsetStickerObjectPosition(
        stickerObject,
        ...transform.translate
      )
      transform.translate = [0, 0]
      target.style.transform = `translate(${0}px, ${0}px)`
      offsetPositionCallback(offsetSticker)
    },
    [stickerObject, transform, offsetPositionCallback]
  )

  return {
    height,
    offsetPosition,
    setCurrentTranslate,
    setSize,
    setStartTranslate,
    sized,
    src: stickerObject.src,
    targetRef,
    width
  }
}
