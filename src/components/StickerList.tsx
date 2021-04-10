import React, { FC } from 'react'
import styled from 'styled-components'
import { Sticker } from './Sticker'
import { useStickerList } from '../hooks/StickerList'
import { StickerObject } from '../lib/StickerObject'

type PresentationalStickerList = FC<{
  className?: string
  generatedClassName?: string
  activateStickerCallback: (stickerObject: StickerObject) => void
  resetStickerTransformCallback: (stickerObject: StickerObject) => void
  stickerObjectList: StickerObject[]
}>

export const PresentationalStickerList = styled<PresentationalStickerList>(
  ({
    className = '',
    generatedClassName = className.split(' ')[1],
    activateStickerCallback,
    resetStickerTransformCallback,
    stickerObjectList
  }) => (
    <div className={className}>
      {stickerObjectList.map(stickerObject => (
        <div
          className={`${generatedClassName}__sticker`}
          key={stickerObject.id}
        >
          <Sticker
            activateCallback={activateStickerCallback}
            resetTransformCallback={resetStickerTransformCallback}
            stickerObject={stickerObject}
          />
        </div>
      ))}
    </div>
  )
)`
  position: relative;

  &__sticker {
    position: absolute;

    ${
      // prettier-ignore
      ({ stickerObjectList }) => stickerObjectList.map((stickerObject, index) => `
        &:nth-child(${index + 1}) {
          top: ${stickerObject.position.top}px;
          left: ${stickerObject.position.left}px;
          transform:
            translateX(${stickerObject.transform.translate[0]}px)
            translateY(${stickerObject.transform.translate[1]}px);
          width: ${stickerObject.width}px;
          height: ${stickerObject.height}px;
        }
      `).join()
    }
  }
`

type StickerList = FC

export const StickerList: StickerList = () => {
  const { stickerObjectList, updateStickerObject } = useStickerList()

  return (
    <PresentationalStickerList
      activateStickerCallback={updateStickerObject}
      resetStickerTransformCallback={updateStickerObject}
      stickerObjectList={stickerObjectList}
    />
  )
}
