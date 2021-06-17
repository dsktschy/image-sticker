import React, { FC, memo, ReactEventHandler } from 'react'
import styled from 'styled-components'
import Moveable, {
  OnDrag,
  OnDragStart,
  OnRotate,
  OnRotateStart,
  OnScale,
  OnScaleStart
} from 'react-moveable'
import { AbleProps, useSticker } from '~/hooks/Sticker'
import { StickerObject } from '~/lib/StickerObject'
import { CornerRotatable } from '~/mixins/CornerRotatable'
import { Editable } from '~/mixins/Editable'

type PresentationalSticker = FC<{
  ableProps: AbleProps
  activated: boolean
  className?: string
  generatedClassName?: string
  height: number
  keepRatio: boolean
  left: number
  onDrag: (event: OnDrag) => void
  onDragStart: (event: OnDragStart) => void
  onLoad: ReactEventHandler<HTMLImageElement>
  onMouseDown: ReactEventHandler<HTMLDivElement>
  onRotate: (event: OnRotate) => void
  onRotateStart: (event: OnRotateStart) => void
  onScale: (event: OnScale) => void
  onScaleStart: (event: OnScaleStart) => void
  src: string
  targetRef: React.RefObject<HTMLDivElement>
  top: number
  width: number
}>

const PresentationalSticker = styled<PresentationalSticker>(
  ({
    ableProps,
    activated,
    className = '',
    generatedClassName = className.split(' ')[1],
    height,
    keepRatio,
    left,
    onDrag,
    onDragStart,
    onLoad,
    onMouseDown,
    onRotate,
    onRotateStart,
    onScale,
    onScaleStart,
    src,
    targetRef,
    top,
    width
  }) => (
    <div className={className} onMouseDown={onMouseDown}>
      <img
        alt=""
        className={`${generatedClassName}__hidden-image`}
        onLoad={onLoad}
        src={src}
      />
      <div
        className={`${generatedClassName}__visible-image`}
        style={{
          top: `${top}px`,
          left: `${left}px`,
          width: `${width}px`,
          height: `${height}px`,
          background: `url(${src}) no-repeat top left/100% 100%`
        }}
        ref={targetRef}
      />
      {activated && (
        <Moveable
          ables={[CornerRotatable, Editable]}
          // ESLint warns if no type-assertion
          className={`${generatedClassName}__Moveable` as string} // eslint-disable-line @typescript-eslint/no-unnecessary-type-assertion
          draggable
          keepRatio={keepRatio}
          onDrag={onDrag}
          onDragStart={onDragStart}
          onRotate={onRotate}
          onRotateStart={onRotateStart}
          onScale={onScale}
          onScaleStart={onScaleStart}
          origin={false}
          props={ableProps}
          rotatable
          scalable
          target={targetRef}
        />
      )}
    </div>
  )
)`
  position: relative;

  &:last-child {
    z-index: 3001;
  }

  &__hidden-image {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    z-index: -1 !important;
    width: 0 !important;
    height: 0 !important;
    opacity: 0 !important;
  }

  &__visible-image {
    position: absolute;
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  &__Moveable {
    opacity: 0;
    transition: opacity 0.1s;

    & > .moveable-rotation {
      display: none !important;
    }

    & > .moveable-control {
      width: 12px !important;
      height: 12px !important;
      margin-top: -6px !important;
      margin-left: -6px !important;
    }
  }

  &:hover &__Moveable {
    opacity: 1;
  }
`

const MemoizedPresentationalSticker = memo(PresentationalSticker)

type Sticker = FC<{
  stickerObject: StickerObject
}>

const Sticker: Sticker = ({ stickerObject }) => {
  const {
    ableProps,
    activate,
    activated,
    bringStickerObjectToFront,
    height,
    keepRatio,
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
  } = useSticker({ stickerObject })

  return (
    <MemoizedPresentationalSticker
      ableProps={ableProps}
      activated={activated}
      height={height}
      keepRatio={keepRatio}
      left={left}
      onDrag={setCurrentTranslate}
      onDragStart={setStartTranslate}
      onLoad={activate}
      onMouseDown={bringStickerObjectToFront}
      onRotate={setCurrentRotate}
      onRotateStart={setStartRotate}
      onScale={setCurrentScale}
      onScaleStart={setStartScale}
      src={stickerObject.src}
      targetRef={targetRef}
      top={top}
      width={width}
    />
  )
}

export default Sticker
