import React from 'react'
import styled from 'styled-components'

interface Props {
  className: string
}
const DefaultPopup = ({ className }: Props) => (
  <div className={className}>
    <label htmlFor="input" className="label">
      Select images
    </label>
    <input
      type="file"
      accept=".png,.jpg,.jpeg,.gif,.svg"
      multiple
      id="input"
      className="input"
    />
  </div>
)

export default styled(DefaultPopup)`
  position: relative;

  & .label {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 200px;
  }

  & .input {
    position: absolute;
    display: none;
  }
`
