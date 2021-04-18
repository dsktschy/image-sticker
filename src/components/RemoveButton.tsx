import React, { FC, ReactEventHandler } from 'react'
import styled from 'styled-components'
import { useRemoveButton } from '../hooks/RemoveButton'
import { StickerObject } from '../lib/StickerObject'

type PresentationalRemoveButton = FC<{
  className?: string
  onClick: ReactEventHandler<HTMLButtonElement>
  rotate: number
  translate: [number, number]
}>

const PresentationalRemoveButton = styled<PresentationalRemoveButton>(
  ({ className = '', onClick, rotate, translate }) => (
    <button
      className={className}
      onClick={onClick}
      // Don't write in template literal to avoid generating classes over and over again
      // https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/utils/createWarnTooManyClasses.js
      style={{
        transform: `
        translate(${translate[0]}px, ${translate[1]}px)
        rotate(${rotate}deg)
        translateX(10px)
      `
      }}
    />
  )
)`
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 15px;
  height: 15px;
  outline: none;
  border: none;
  padding: 0;
  appearance: none;
  background: transparent;
  transform-origin: 0px 0px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 2px;
    height: 19px;
    border-radius: 1000px;
    background: var(--moveable-color);
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`

type RemoveButton = FC<{
  rotate: number
  stickerObject: StickerObject
  translate: [number, number]
}>

export const RemoveButton: RemoveButton = ({
  rotate,
  stickerObject,
  translate
}) => {
  const { removeStickerObject } = useRemoveButton({ stickerObject })

  return (
    <PresentationalRemoveButton
      onClick={removeStickerObject}
      rotate={rotate}
      translate={translate}
    />
  )
}
