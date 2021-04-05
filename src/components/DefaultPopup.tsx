import React, { FC } from 'react'
import styled from 'styled-components'
import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone'
import { useDefaultPopup } from '../hooks/DefaultPopup'

type PresentationalDefaultPopup = FC<{
  className?: string
  generatedClassName?: string
  getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps
  getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps
  onClick: () => void
}>

export const PresentationalDefaultPopup = styled<PresentationalDefaultPopup>(
  ({
    className = '',
    generatedClassName = className.split(' ')[1],
    getInputProps,
    getRootProps,
    onClick
  }) => (
    <div {...getRootProps({ className, onClick })}>
      <input {...getInputProps()} />
      <p className={`${generatedClassName}__text`}>
        Drop images here
        <br />
        or
        <br />
        Click to select images
      </p>
    </div>
  )
)`
  &__text {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 240px;
    height: 240px;
    margin: 0;
    font: bold 14px/1.5 sans-serif;
    text-align: center;
  }
`

type DefaultPopup = FC

export const DefaultPopup: DefaultPopup = () => {
  const {
    getInputProps,
    getRootProps,
    sendClickMessageToBackground
  } = useDefaultPopup()

  return (
    <PresentationalDefaultPopup
      getInputProps={getInputProps}
      getRootProps={getRootProps}
      onClick={sendClickMessageToBackground}
    />
  )
}
