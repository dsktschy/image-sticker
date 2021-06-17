import React from 'react'
import {
  Able,
  MoveableManagerInterface,
  Rotatable,
  RotatableProps
} from 'react-moveable'
import RotationHandle from '~/components/RotationHandle'

const translateOffset = 8

type CornerRotatableProps = RotatableProps & {
  'corner-rotatable': boolean
}

export const CornerRotatable: Able = {
  ...Rotatable,
  name: 'corner-rotatable',
  props: {
    ...Rotatable.props,
    'corner-rotatable': Boolean
  },
  render(moveable: MoveableManagerInterface<CornerRotatableProps>) {
    const { rotatable, zoom } = moveable.props
    if (!rotatable) return []

    const { pos1, pos2, pos3, pos4 } = moveable.state
    const rotate = moveable.getRect().rotation
    const scale = zoom || 1
    return [
      {
        key: 'corner-rotatable-pos1',
        rotate,
        scale,
        translateAfterRotation: [-translateOffset, -translateOffset],
        translateBeforeRotation: pos1
      },
      {
        key: 'corner-rotatable-pos2',
        rotate,
        scale,
        translateAfterRotation: [translateOffset, -translateOffset],
        translateBeforeRotation: pos2
      },
      {
        key: 'corner-rotatable-pos3',
        rotate,
        scale,
        translateAfterRotation: [-translateOffset, translateOffset],
        translateBeforeRotation: pos3
      },
      {
        key: 'corner-rotatable-pos4',
        rotate,
        scale,
        translateAfterRotation: [translateOffset, translateOffset],
        translateBeforeRotation: pos4
      }
    ].map(props => <RotationHandle {...props} />)
  }
}
