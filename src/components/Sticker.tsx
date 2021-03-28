import React, { FC, ReactEventHandler } from 'react'
import styled from 'styled-components'
import Moveable, { OnDrag, OnDragEnd, OnDragStart } from 'react-moveable'
import { useSticker } from '../hooks/Sticker'
import { StickerObject } from '../lib/StickerObject'

type PresentationalSticker = FC<{
  className?: string
  generatedClassName?: string
  height: number
  onDrag: (event: OnDrag) => void
  onDragEnd: (event: OnDragEnd) => void
  onDragStart: (event: OnDragStart) => void
  onLoad: ReactEventHandler<HTMLImageElement>
  sized: boolean
  src: string
  targetRef: React.RefObject<HTMLImageElement>
  width: number
}>

export const PresentationalSticker = styled<PresentationalSticker>(
  ({
    className = '',
    generatedClassName = className.split(' ')[1],
    onDrag,
    onDragEnd,
    onDragStart,
    onLoad,
    sized,
    src,
    targetRef
  }) => (
    <div className={className}>
      <img
        alt=""
        className={`${generatedClassName}__image`}
        onLoad={onLoad}
        ref={targetRef}
        src={src}
      />
      {sized && (
        <Moveable
          className={`${generatedClassName}__Moveable`}
          draggable
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          target={targetRef}
        />
      )}
    </div>
  )
)`
  &__image {
    width: ${({ width }) => (width ? `${width}px` : 'auto')};
    min-width: 0;
    max-width: none;
    height: ${({ height }) => (height ? `${height}px` : 'auto')};
    min-height: 0;
    max-height: none;
    vertical-align: top;
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
  offsetPositionCallback: (stickerObject: StickerObject) => void
  stickerObject: StickerObject
}>

export const Sticker: Sticker = ({ offsetPositionCallback, stickerObject }) => {
  const {
    height,
    offsetPosition,
    setCurrentTranslate,
    setSize,
    setStartTranslate,
    sized,
    src,
    targetRef,
    width
  } = useSticker({
    offsetPositionCallback,
    stickerObject
  })

  return (
    <PresentationalSticker
      height={height}
      onDrag={setCurrentTranslate}
      onDragEnd={offsetPosition}
      onDragStart={setStartTranslate}
      onLoad={setSize}
      sized={sized}
      src={src}
      targetRef={targetRef}
      width={width}
    />
  )
}
