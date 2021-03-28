import React, { FC } from 'react'
import styled from 'styled-components'
import { Sticker } from './Sticker'
import { useStickerList } from '../hooks/StickerList'
import { StickerObject } from '../lib/StickerObject'

type PresentationalStickerList = FC<{
  className?: string
  generatedClassName?: string
  stickerObjectList: StickerObject[]
}>

export const PresentationalStickerList = styled<PresentationalStickerList>(
  ({
    className = '',
    generatedClassName = className.split(' ')[1],
    stickerObjectList
  }) => (
    <div className={className}>
      {stickerObjectList.map(stickerObject => (
        <div
          className={`${generatedClassName}__sticker`}
          key={stickerObject.id}
        >
          <Sticker stickerObject={stickerObject} />
        </div>
      ))}
    </div>
  )
)`
  position: relative;

  &__sticker {
    position: absolute;
    transform: translate(-50%, -50%);

    ${
      // prettier-ignore
      ({ stickerObjectList }) => stickerObjectList.map((stickerObject, index) => `
        &:nth-child(${index + 1}) {
          top: ${stickerObject.position.top}px;
          left: ${stickerObject.position.left}px;
        }
      `).join()
    }
  }
`

type StickerList = FC

export const StickerList: StickerList = () => {
  const { stickerObjectList } = useStickerList()

  return <PresentationalStickerList stickerObjectList={stickerObjectList} />
}
