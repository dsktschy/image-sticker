import {
  ReactEventHandler,
  RefObject,
  useCallback,
  useRef,
  useState
} from 'react'
import { OnDrag, OnDragStart } from 'react-moveable'

type UseSticker = () => {
  activate: ReactEventHandler<HTMLImageElement>
  activated: boolean
  height: number
  left: number
  setCurrentTranslate: (event: OnDrag) => void
  setStartTranslate: (event: OnDragStart) => void
  targetRef: RefObject<HTMLImageElement>
  top: number
  width: number
}

type Transform = {
  translate: [number, number]
}

export const useSticker: UseSticker = () => {
  const targetRef = useRef<HTMLImageElement>(null)

  const [top, setTop] = useState(0)

  const [left, setLeft] = useState(0)

  const [width, setWidth] = useState(0)

  const [height, setHeight] = useState(0)

  const [transform] = useState<Transform>({
    translate: [0, 0]
  })

  const [activated, setActivated] = useState(false)

  const activate = useCallback<ReactEventHandler<HTMLImageElement>>(
    ({ currentTarget }) => {
      const { naturalWidth, naturalHeight, ownerDocument } = currentTarget
      setWidth(naturalWidth)
      setHeight(naturalHeight)
      const { documentElement } = ownerDocument
      const { clientWidth, clientHeight } = documentElement
      setTop(clientHeight / 2 - naturalHeight / 2)
      setLeft(clientWidth / 2 - naturalWidth / 2)
      setActivated(true)
    },
    []
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

  return {
    activate,
    activated,
    height,
    left,
    setCurrentTranslate,
    setStartTranslate,
    targetRef,
    top,
    width
  }
}
