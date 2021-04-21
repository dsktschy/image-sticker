import React, { FC } from 'react'
import styled from 'styled-components'

type PresentationalRotationHandle = FC<{
  className?: string
  rotate: number
  scale: number
  translateAfterRotation: number[]
  translateBeforeRotation: number[]
}>

const PresentationalRotationHandle = styled<PresentationalRotationHandle>(
  ({
    className = '',
    rotate,
    scale,
    translateAfterRotation,
    translateBeforeRotation
  }) => (
    <div
      className={`${className} moveable-rotation-control`}
      // Don't write in template literal to avoid generating classes over and over again
      // https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/utils/createWarnTooManyClasses.js
      style={{
        transform: `
          translate(${translateBeforeRotation[0]}px, ${translateBeforeRotation[1]}px)
          rotate(${rotate}deg)
          scale(${scale})
          translate(${translateAfterRotation[0]}px, ${translateAfterRotation[1]}px)
        `
      }}
    />
  )
)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
  width: 30px;
  height: 30px;
  margin-top: -15px;
  margin-left: -15px;
  cursor: alias;
`

type RotationHandle = FC<{
  rotate: number
  scale: number
  translateAfterRotation: number[]
  translateBeforeRotation: number[]
}>

export const RotationHandle: RotationHandle = ({
  rotate,
  scale,
  translateAfterRotation,
  translateBeforeRotation
}) => {
  return (
    <PresentationalRotationHandle
      rotate={rotate}
      scale={scale}
      translateAfterRotation={translateAfterRotation}
      translateBeforeRotation={translateBeforeRotation}
    />
  )
}
