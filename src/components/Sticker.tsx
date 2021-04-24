import React, { FC, ReactEventHandler } from 'react'
import styled from 'styled-components'
import Moveable, {
  OnDrag,
  OnDragStart,
  OnRotate,
  OnRotateStart,
  OnScale,
  OnScaleStart
} from 'react-moveable'
import { CornerRotatable } from '../mixins/CornerRotatable'
import { Editable } from '../mixins/Editable'
import { AbleProps, useSticker } from '../hooks/Sticker'
import { StickerObject } from '../lib/StickerObject'

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
  onRotate: (event: OnRotate) => void
  onRotateStart: (event: OnRotateStart) => void
  onScale: (event: OnScale) => void
  onScaleStart: (event: OnScaleStart) => void
  src: string
  targetRef: React.RefObject<HTMLImageElement>
  top: number
  width: number
}>

export const PresentationalSticker = styled<PresentationalSticker>(
  ({
    ableProps,
    activated,
    className = '',
    generatedClassName = className.split(' ')[1],
    height,
    keepRatio,
    onDrag,
    onDragStart,
    onLoad,
    onRotate,
    onRotateStart,
    onScale,
    onScaleStart,
    src,
    targetRef,
    width
  }) => (
    <div className={className}>
      <img
        alt=""
        className={`${generatedClassName}__image`}
        height={height}
        onLoad={onLoad}
        ref={targetRef}
        src={src}
        width={width}
      />
      {activated && (
        <Moveable
          ables={[CornerRotatable, Editable]}
          className={`${generatedClassName}__Moveable`}
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

  &__image {
    position: absolute;
    min-width: 0;
    max-width: none;
    min-height: 0;
    max-height: none;
    vertical-align: top;
    cursor: grab;
    ${({ height, left, top, width }) => `
      top: ${top}px;
      left: ${left}px;
      width: ${width}px;
      height: ${height}px;
    `}

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

type Sticker = FC<{
  stickerObject: StickerObject
}>

export const Sticker: Sticker = ({ stickerObject }) => {
  const {
    ableProps,
    activate,
    activated,
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
    <PresentationalSticker
      ableProps={ableProps}
      activated={activated}
      height={height}
      keepRatio={keepRatio}
      left={left}
      onDrag={setCurrentTranslate}
      onDragStart={setStartTranslate}
      onLoad={activate}
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
