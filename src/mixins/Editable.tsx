import React from 'react'
import { Able, MoveableManagerInterface } from 'react-moveable'
import { EditButtonList } from '../components/EditButtonList'
import { StickerObject } from '../lib/StickerObject'

interface EditableProps {
  editable: boolean
  stickerObject: StickerObject
}

export const Editable: Able = {
  events: {},
  name: 'editable',
  props: {
    editable: Boolean,
    stickerObject: Object
  },
  render(moveable: MoveableManagerInterface<EditableProps>) {
    return (
      <EditButtonList
        key="editable"
        rotate={moveable.getRect().rotation}
        stickerObject={moveable.props.stickerObject}
        translate={moveable.state.pos2}
      />
    )
  }
}
