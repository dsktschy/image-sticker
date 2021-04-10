import React, { FC, ReactEventHandler } from 'react'
import styled from 'styled-components'
import Moveable, { OnDrag, OnDragEnd, OnDragStart } from 'react-moveable'
import { useSticker } from '../hooks/Sticker'
import { StickerObject } from '../lib/StickerObject'

type PresentationalSticker = FC<{
  activated: boolean
  className?: string
  generatedClassName?: string
  onDrag: (event: OnDrag) => void
  onDragEnd: (event: OnDragEnd) => void
  onDragStart: (event: OnDragStart) => void
  onLoad: ReactEventHandler<HTMLImageElement>
  src: string
  targetRef: React.RefObject<HTMLImageElement>
}>

export const PresentationalSticker = styled<PresentationalSticker>(
  ({
    activated,
    className = '',
    generatedClassName = className.split(' ')[1],
    onDrag,
    onDragEnd,
    onDragStart,
    onLoad,
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
      {activated && (
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
    width: 100%;
    min-width: 0;
    max-width: none;
    height: 100%;
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
  activateCallback: (stickerObject: StickerObject) => void
  resetTransformCallback: (stickerObject: StickerObject) => void
  stickerObject: StickerObject
}>

export const Sticker: Sticker = ({
  activateCallback,
  resetTransformCallback,
  stickerObject
}) => {
  const {
    activate,
    activated,
    resetTransform,
    setCurrentTranslate,
    setStartTranslate,
    src,
    targetRef
  } = useSticker({
    activateCallback,
    resetTransformCallback,
    stickerObject
  })

  return (
    <PresentationalSticker
      onDrag={setCurrentTranslate}
      onDragEnd={resetTransform}
      onDragStart={setStartTranslate}
      onLoad={activate}
      activated={activated}
      src={src}
      targetRef={targetRef}
    />
  )
}
