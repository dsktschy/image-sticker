import React from 'react'
import { Able, MoveableManagerInterface } from 'react-moveable'
import { RemoveButton } from '../components/RemoveButton'
import { StickerObject } from '../lib/StickerObject'

interface RemovableProps {
  removable: boolean
  stickerObject: StickerObject
}

export const Removable: Able = {
  events: {},
  name: 'removable',
  props: {
    removable: Boolean,
    stickerObject: Object
  },
  render(moveable: MoveableManagerInterface<RemovableProps>) {
    return (
      <RemoveButton
        key="removable"
        rotate={moveable.getRect().rotation}
        stickerObject={moveable.props.stickerObject}
        translate={moveable.state.pos2}
      />
    )
  }
}
