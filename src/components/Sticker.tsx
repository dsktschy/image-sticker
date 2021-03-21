import React, { FC, ReactEventHandler } from 'react'
import styled from 'styled-components'
import Moveable, { OnDrag, OnDragStart } from 'react-moveable'
import { useSticker } from '../hooks/Sticker'
import { Sticker as StickerObject } from '../lib/Sticker'

type PresentationalSticker = FC<{
  className?: string
  generatedClassName?: string
  height: number
  onDrag: (event: OnDrag) => void
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
          draggable
          onDragStart={onDragStart}
          onDrag={onDrag}
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
  }
`

type Sticker = FC<{
  sticker: StickerObject
}>

export const Sticker: Sticker = ({ sticker }) => {
  const {
    height,
    setCurrentTranslate,
    setSize,
    setStartTranslate,
    sized,
    src,
    targetRef,
    width
  } = useSticker({
    sticker
  })

  return (
    <PresentationalSticker
      height={height}
      onDrag={setCurrentTranslate}
      onDragStart={setStartTranslate}
      onLoad={setSize}
      sized={sized}
      src={src}
      targetRef={targetRef}
      width={width}
    />
  )
}
