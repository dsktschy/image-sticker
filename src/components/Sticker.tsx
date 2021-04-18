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
import { Removable } from '../mixins/Removable'
import { AbleProps, useSticker } from '../hooks/Sticker'
import { StickerObject } from '../lib/StickerObject'

type PresentationalSticker = FC<{
  ableProps: AbleProps
  activated: boolean
  className?: string
  generatedClassName?: string
  height: number
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
          ables={[Removable]}
          className={`${generatedClassName}__Moveable`}
          draggable
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

  &__image {
    position: absolute;
    min-width: 0;
    max-width: none;
    min-height: 0;
    max-height: none;
    vertical-align: top;
    ${({ height, left, top, width }) => `
      top: ${top}px;
      left: ${left}px;
      width: ${width}px;
      height: ${height}px;
    `}
  }

  &__Moveable {
    opacity: 0;
    transition: opacity 0.1s;
  }

  &:hover > &__Moveable {
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
