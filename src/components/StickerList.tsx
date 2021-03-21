import React, { FC } from 'react'
import styled from 'styled-components'
import { Sticker } from './Sticker'
import { useStickerList } from '../hooks/StickerList'
import { Sticker as StickerObject } from '../lib/Sticker'

type PresentationalStickerList = FC<{
  className?: string
  generatedClassName?: string
  stickerList: StickerObject[]
}>

export const PresentationalStickerList = styled<PresentationalStickerList>(
  ({
    className = '',
    generatedClassName = className.split(' ')[1],
    stickerList
  }) => (
    <div className={className}>
      {stickerList.map(sticker => (
        <div className={`${generatedClassName}__sticker`} key={sticker.id}>
          <Sticker sticker={sticker} />
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
      ({ stickerList }) => stickerList.map((sticker, index) => `
        &:nth-child(${index + 1}) {
          top: ${sticker.position.top}px;
          left: ${sticker.position.left}px;
        }
      `).join()
    }
  }
`

type StickerList = FC

export const StickerList: StickerList = () => {
  const { stickerList } = useStickerList()

  return <PresentationalStickerList stickerList={stickerList} />
}
