import React, { FC } from 'react'
import styled from 'styled-components'
import {
  DropzoneInputProps,
  DropzoneRootProps,
  useDropzone
} from 'react-dropzone'
import { useDefaultPopup } from '../hooks/DefaultPopup'

type PresentationalDefaultPopup = FC<{
  className?: string
  generatedClassName?: string
  getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps
  getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps
}>

export const PresentationalDefaultPopup = styled<PresentationalDefaultPopup>(
  ({
    className = '',
    generatedClassName = className.split(' ')[1],
    getInputProps,
    getRootProps
  }) => (
    <div {...getRootProps({ className })}>
      <input {...getInputProps()} />
      <p className={`${generatedClassName}__message`}>Drop images here</p>
    </div>
  )
)`
  &__message {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 200px;
    margin: 0;
    font: bold 12px/1.2 sans-serif;
  }
`

type DefaultPopup = FC

export const DefaultPopup: DefaultPopup = () => {
  const { readFileList } = useDefaultPopup()
  const { getInputProps, getRootProps } = useDropzone({
    accept: '.png,.jpg,.jpeg,.gif,.svg',
    noClick: true,
    noKeyboard: true,
    onDrop: readFileList
  })

  return (
    <PresentationalDefaultPopup
      getInputProps={getInputProps}
      getRootProps={getRootProps}
    />
  )
}
