import {
  ReactEventHandler,
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react'
import { OnDrag, OnDragStart } from 'react-moveable'
import { Sticker } from '../lib/Sticker'

type UseSticker = (props: {
  sticker: Sticker
}) => {
  height: number
  setCurrentTranslate: (event: OnDrag) => void
  setSize: ReactEventHandler<HTMLImageElement>
  setStartTranslate: (event: OnDragStart) => void
  sized: boolean
  src: string
  targetRef: RefObject<HTMLImageElement>
  width: number
}

export const useSticker: UseSticker = ({ sticker }) => {
  const targetRef = useRef<HTMLImageElement>(null)

  const [width, setWidth] = useState(0)

  const [height, setHeight] = useState(0)

  const [transform] = useState({ translate: [0, 0] })

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
      const [x, y] = (transform.translate = beforeTranslate)
      target.style.transform = `translate(${x}px, ${y}px)`
    },
    [transform]
  )

  return {
    height,
    setCurrentTranslate,
    setSize,
    setStartTranslate,
    sized,
    src: sticker.src,
    targetRef,
    width
  }
}
