import React, { FC } from 'react'
import styled from 'styled-components'
import { StickerList } from './StickerList'
import { useContentScript } from '../hooks/ContentScript'

type PresentationalContentScript = FC<{
  className?: string
  generatedClassName?: string
}>

export const PresentationalContentScript = styled<PresentationalContentScript>(
  ({ className = '' }) => (
    <div className={className}>
      <StickerList />
    </div>
  )
)`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2147483647;
`

type ContentScript = FC

export const ContentScript: ContentScript = () => {
  useContentScript()

  return <PresentationalContentScript />
}
