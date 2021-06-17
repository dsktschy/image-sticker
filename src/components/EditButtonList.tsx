import React, { FC, memo, ReactEventHandler } from 'react'
import styled from 'styled-components'
import { useEditButtonList } from '~/hooks/EditButtonList'
import { StickerObject } from '~/lib/StickerObject'

type PresentationalEditButtonList = FC<{
  className?: string
  generatedClassName?: string
  onMouseDownCaptureCloneButton: ReactEventHandler<HTMLDivElement>
  onMouseDownCaptureRemoveButton: ReactEventHandler<HTMLDivElement>
  rotate: number
  translate: number[]
}>

const PresentationalEditButtonList = styled<PresentationalEditButtonList>(
  ({
    className = '',
    generatedClassName = className.split(' ')[1],
    onMouseDownCaptureCloneButton,
    onMouseDownCaptureRemoveButton,
    rotate,
    translate
  }) => (
    <div className={className}>
      <div
        className={`${generatedClassName}__clone-button`}
        onMouseDownCapture={onMouseDownCaptureCloneButton}
        style={{
          transform: `
            translate(${translate[0]}px, ${translate[1]}px)
            rotate(${rotate}deg)
            translateX(10px)
          `
        }}
      />
      <div
        className={`${generatedClassName}__remove-button`}
        onMouseDownCapture={onMouseDownCaptureRemoveButton}
        style={{
          transform: `
            translate(${translate[0]}px, ${translate[1]}px)
            rotate(${rotate}deg)
            translate(10px, 20px)
          `
        }}
      />
    </div>
  )
)`
  &__clone-button,
  &__remove-button {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 11;
    display: block;
    width: 12px;
    height: 12px;
    transform-origin: 0px 0px;
    cursor: pointer;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 2px;
      border-radius: 1000px;
      background: var(--moveable-color);
    }

    &::before {
      transform: translate(-50%, -50%);
    }

    &::after {
      transform: translate(-50%, -50%) rotate(90deg);
    }
  }

  &__clone-button {
    &::after {
      display: block;
    }
  }

  &__remove-button {
    &::after {
      display: none;
    }
  }
`

const MemoizedPresentationalEditButtonList = memo(PresentationalEditButtonList)

type EditButtonList = FC<{
  rotate: number
  stickerObject: StickerObject
  translate: number[]
}>

const EditButtonList: EditButtonList = ({
  rotate,
  stickerObject,
  translate
}) => {
  const { cloneStickerObject, removeStickerObject } = useEditButtonList({
    stickerObject
  })

  return (
    <MemoizedPresentationalEditButtonList
      onMouseDownCaptureCloneButton={cloneStickerObject}
      onMouseDownCaptureRemoveButton={removeStickerObject}
      rotate={rotate}
      translate={translate}
    />
  )
}

export default EditButtonList
