import React, { FC, memo } from 'react'
import styled from 'styled-components'
import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone'
import StickerList from '~/components/StickerList'
import { useContentScript } from '~/hooks/ContentScript'

const MemoizedStickerList = memo(StickerList)

type PresentationalContentScript = FC<{
  className?: string
  generatedClassName?: string
  getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps
  getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps
}>

const PresentationalContentScript = styled<PresentationalContentScript>(
  ({ className = '', getInputProps, getRootProps }) => (
    <div {...getRootProps({ className })}>
      <input {...getInputProps({ id: 'imgstckr-ContentScript__input' })} />
      <MemoizedStickerList />
    </div>
  )
)`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2147483647;
`

const MemoizedPresentationalContentScript = memo(PresentationalContentScript)

type ContentScript = FC

const ContentScript: ContentScript = () => {
  const { getInputProps, getRootProps } = useContentScript()

  return (
    <MemoizedPresentationalContentScript
      getInputProps={getInputProps}
      getRootProps={getRootProps}
    />
  )
}

export default ContentScript
