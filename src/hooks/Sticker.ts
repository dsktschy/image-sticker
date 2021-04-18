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

  // Make sure that the width and height are not less than 1px,
  // to make edges always active
  const minScale = useMemo(() => [1 / width, 1 / height], [width, height])

  const [activated, setActivated] = useState(false)

  const activate = useCallback<ReactEventHandler<HTMLImageElement>>(
    ({ currentTarget }) => {
      const { naturalWidth, naturalHeight, ownerDocument } = currentTarget
      setWidth(naturalWidth)
      setHeight(naturalHeight)
      const { clientWidth, clientHeight } = ownerDocument.documentElement
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
      transform.translate = beforeTranslate as [number, number]
      target.style.transform = `
        translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)
        rotate(${transform.rotate}deg)
        scale(${transform.scale[0]}, ${transform.scale[1]})
      `
    },
    [transform]
  )

  const setCurrentScale = useCallback<(event: OnScale) => void>(
    ({ drag, target, scale }) => {
      transform.translate = drag.beforeTranslate as [number, number]
      const scaleX = scale[0] > minScale[0] ? scale[0] : minScale[0]
      const scaleY = scale[1] > minScale[1] ? scale[1] : minScale[1]
      transform.scale = [scaleX, scaleY]
      target.style.transform = `
        translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)
        rotate(${transform.rotate}deg)
        scale(${scaleX}, ${scaleY})
      `
    },
    [transform, minScale]
  )

  const setCurrentRotate = useCallback<(event: OnRotate) => void>(
    ({ target, beforeRotate }) => {
      transform.rotate = beforeRotate
      target.style.transform = `
        translate(${transform.translate[0]}px, ${transform.translate[1]}px)
        rotate(${beforeRotate}deg)
        scale(${transform.scale[0]}, ${transform.scale[1]})
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
