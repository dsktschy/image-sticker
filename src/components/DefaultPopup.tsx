import React, { FC, ReactEventHandler } from 'react'
import styled from 'styled-components'
import { useDefaultPopup } from '../hooks/DefaultPopup'

type PresentationalDefaultPopup = FC<{
  className?: string
  generatedClassName?: string
  onChange: ReactEventHandler<HTMLInputElement>
}>

export const PresentationalDefaultPopup = styled<PresentationalDefaultPopup>(
  ({
    className = '',
    generatedClassName = className.split(' ')[1],
    onChange
  }) => (
    <div className={className}>
      <label className={`${generatedClassName}__label`} htmlFor="input">
        Select images
      </label>
      <input
        accept=".png,.jpg,.jpeg,.gif,.svg"
        className={`${generatedClassName}__input`}
        id="input"
        multiple
        onChange={onChange}
        type="file"
      />
    </div>
  )
)`
  position: relative;

  &__label {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 200px;
  }

  &__input {
    position: absolute;
    display: none;
  }
`

type DefaultPopup = FC

export const DefaultPopup: DefaultPopup = () => {
  const { readFileList } = useDefaultPopup()

  return <PresentationalDefaultPopup onChange={readFileList} />
}
