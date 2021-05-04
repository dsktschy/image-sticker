import React, { FC, memo } from 'react'
import styled from 'styled-components'
import { Sticker } from '~/components/Sticker'
import { useStickerList } from '~/hooks/StickerList'
import { StickerObject } from '~/lib/StickerObject'

type PresentationalStickerList = FC<{
  className?: string
  generatedClassName?: string
  stickerObjectList: StickerObject[]
}>

export const PresentationalStickerList = styled<PresentationalStickerList>(
  ({ className = '', stickerObjectList }) => (
    <div className={className}>
      {stickerObjectList.map(stickerObject => (
        <Sticker key={stickerObject.id} stickerObject={stickerObject} />
      ))}
    </div>
  )
)``

type StickerList = FC

export const StickerList: StickerList = memo(() => {
  const { stickerObjectList } = useStickerList()

  return <PresentationalStickerList stickerObjectList={stickerObjectList} />
})
