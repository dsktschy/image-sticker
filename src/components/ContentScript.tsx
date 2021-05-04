import React, { FC, memo } from 'react'
import styled from 'styled-components'
import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone'
import { StickerList } from '~/components/StickerList'
import { useContentScript } from '~/hooks/ContentScript'

type PresentationalContentScript = FC<{
  className?: string
  generatedClassName?: string
  getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps
  getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps
}>

export const PresentationalContentScript = memo(
  styled<PresentationalContentScript>(
    ({ className = '', getInputProps, getRootProps }) => (
      <div {...getRootProps({ className })}>
        <input {...getInputProps()} />
        <StickerList />
      </div>
    )
  )`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2147483647;
  `
)

type ContentScript = FC

export const ContentScript: ContentScript = () => {
  const { getInputProps, getRootProps } = useContentScript()

  return (
    <PresentationalContentScript
      getInputProps={getInputProps}
      getRootProps={getRootProps}
    />
  )
}
