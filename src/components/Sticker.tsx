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
import { useSticker } from '../hooks/Sticker'

type PresentationalSticker = FC<{
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
          className={`${generatedClassName}__Moveable`}
          draggable
          onDrag={onDrag}
          onDragStart={onDragStart}
          onRotate={onRotate}
          onRotateStart={onRotateStart}
          onScale={onScale}
          onScaleStart={onScaleStart}
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
  src: string
}>

export const Sticker: Sticker = ({ src }) => {
  const {
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
  } = useSticker()

  return (
    <PresentationalSticker
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
      src={src}
      targetRef={targetRef}
      top={top}
      width={width}
    />
  )
}
