import React, { FC } from 'react'
import styled from 'styled-components'
import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone'
import { useDefaultPopup } from '~/hooks/DefaultPopup'

type PresentationalDefaultPopup = FC<{
  className?: string
  generatedClassName?: string
  getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps
  getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps
  languages: { [key: string]: string }
  onClick: () => void
}>

export const PresentationalDefaultPopup = styled<PresentationalDefaultPopup>(
  ({
    className = '',
    generatedClassName = className.split(' ')[1],
    getInputProps,
    getRootProps,
    languages,
    onClick
  }) => (
    <div {...getRootProps({ className, onClick })}>
      <svg
        className={`${generatedClassName}__image`}
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 32V48H32V32H48L32 16L16 32L8 24L0 32Z" fill="#B0E0D2" />
        <path d="M32 32H48L32 48V32Z" fill="#EA6163" />
        <path d="M0 0V32L8 24L16 32L32 16L48 32V0H0Z" fill="#5984BE" />
        <circle cx="16" cy="13" r="8" fill="#F0B82D" />
      </svg>
      <input {...getInputProps()} />
      <p className={`${generatedClassName}__text`}>
        {languages.dropImagesHere}
        <br />
        {languages.or}
        <br />
        {languages.clickToSelectImages}
      </p>
    </div>
  )
)`
  &__image {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0.2;
    filter: saturate(2);
  }

  &__text {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 240px;
    height: 240px;
    margin: 0;
    font: bold 14px/1.75 sans-serif;
    text-align: center;
  }
`

type DefaultPopup = FC

export const DefaultPopup: DefaultPopup = () => {
  const {
    getInputProps,
    getRootProps,
    languages,
    sendClickMessageToBackground
  } = useDefaultPopup()

  return (
    <PresentationalDefaultPopup
      getInputProps={getInputProps}
      getRootProps={getRootProps}
      languages={languages}
      onClick={sendClickMessageToBackground}
    />
  )
}
