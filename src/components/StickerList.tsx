import React, { FC } from 'react'
import styled from 'styled-components'
import Sticker from '~/components/Sticker'
import { useStickerList } from '~/hooks/StickerList'
import { StickerObject } from '~/lib/StickerObject'

type PresentationalStickerList = FC<{
  className?: string
  generatedClassName?: string
  stickerObjectList: StickerObject[]
}>

const PresentationalStickerList = styled<PresentationalStickerList>(
  ({ className = '', stickerObjectList }) => (
    <div className={className} id="imgstckr-StickerList">
      {stickerObjectList.map(stickerObject => (
        <Sticker key={stickerObject.id} stickerObject={stickerObject} />
      ))}
    </div>
  )
)``

type StickerList = FC

const StickerList: StickerList = () => {
  const { stickerObjectList } = useStickerList()

  return <PresentationalStickerList stickerObjectList={stickerObjectList} />
}

export default StickerList
