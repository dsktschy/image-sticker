import {
  ReactEventHandler,
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react'
import {
  OnDrag,
  OnDragStart,
  OnRotate,
  OnRotateStart,
  OnScale,
  OnScaleStart
} from 'react-moveable'
import { StickerObject } from '../lib/StickerObject'

export interface AbleProps {
  removable: boolean
  stickerObject: StickerObject
}

interface Transform {
  rotate: number
  scale: [number, number]
  translate: [number, number]
}

type UseSticker = (props: {
  stickerObject: StickerObject
}) => {
  ableProps: AbleProps
  activate: ReactEventHandler<HTMLImageElement>
  activated: boolean
  height: number
  left: number
  setCurrentRotate: (event: OnRotate) => void
  setCurrentScale: (event: OnScale) => void
  setCurrentTranslate: (event: OnDrag) => void
  setStartRotate: (event: OnRotateStart) => void
  setStartScale: (event: OnScaleStart) => void
  setStartTranslate: (event: OnDragStart) => void
  targetRef: RefObject<HTMLImageElement>
  top: number
  width: number
}

export const useSticker: UseSticker = ({ stickerObject }) => {
  const targetRef = useRef<HTMLImageElement>(null)

  const ableProps = useMemo<AbleProps>(
    () => ({
      removable: true,
      stickerObject
    }),
    [stickerObject]
  )

  const [top, setTop] = useState(0)

  const [left, setLeft] = useState(0)

  const [width, setWidth] = useState(0)

  const [height, setHeight] = useState(0)

  const [transform] = useState<Transform>({
    rotate: 0,
    scale: [1, 1],
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

  const setStartScale = useCallback<(event: OnScaleStart) => void>(
    ({ set, dragStart }) => {
      set(transform.scale)
      if (dragStart) dragStart.set(transform.translate)
    },
    [transform]
  )

  const setStartRotate = useCallback<(event: OnRotateStart) => void>(
    ({ set }) => {
      set(transform.rotate)
    },
    [transform]
  )

  const setCurrentTranslate = useCallback<(event: OnDrag) => void>(
    ({ target, beforeTranslate }) => {
      const [translateX, translateY] = beforeTranslate
      const [scaleX, scaleY] = transform.scale
      const rotate = transform.rotate
      transform.translate = [translateX, translateY]
      target.style.transform = `
        translate(${translateX}px, ${translateY}px)
        scale(${scaleX}, ${scaleY})
        rotate(${rotate}deg)
      `
    },
    [transform]
  )

  const setCurrentScale = useCallback<(event: OnScale) => void>(
    ({ drag, target, scale }) => {
      const [translateX, translateY] = drag.beforeTranslate
      const [scaleX, scaleY] = scale
      const rotate = transform.rotate
      transform.translate = [translateX, translateY]
      transform.scale = [scaleX, scaleY]
      target.style.transform = `
        translate(${translateX}px, ${translateY}px)
        scale(${scaleX}, ${scaleY})
        rotate(${rotate}deg)
      `
    },
    [transform]
  )

  const setCurrentRotate = useCallback<(event: OnRotate) => void>(
    ({ target, beforeRotate }) => {
      const [translateX, translateY] = transform.translate
      const [scaleX, scaleY] = transform.scale
      const rotate = beforeRotate
      transform.rotate = rotate
      target.style.transform = `
        translate(${translateX}px, ${translateY}px)
        scale(${scaleX}, ${scaleY})
        rotate(${rotate}deg)
      `
    },
    [transform]
  )

  return {
    ableProps,
    activate,
    activated,
    height,
    left,
    setCurrentRotate,
    setCurrentScale,
    setCurrentTranslate,
    setStartRotate,
    setStartScale,
    setStartTranslate,
    targetRef,
    top,
    width
  }
}
