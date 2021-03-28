import React, {
  createContext,
  Dispatch,
  FC,
  useReducer,
  useContext
} from 'react'
import { StickerObject } from '../lib/StickerObject'
import {
  addStickerObjectList,
  removeStickerObjectList
} from '../lib/StickerObjectList'

interface StickerObjectListAction {
  payload: {
    stickerObjectList: StickerObject[]
  }
  type: 'add' | 'remove'
}

type Value = [StickerObject[], Dispatch<StickerObjectListAction>]

const StickerObjectListContext = createContext<Value | null>(null)

export const useStickerObjectListContext = (): Value => {
  const value = useContext(StickerObjectListContext)
  if (!value) throw new Error('NonConsumerError')
  return value
}

const stickerObjectListReducer = (
  stickerObjectList: StickerObject[],
  { payload, type }: StickerObjectListAction
): StickerObject[] => {
  switch (type) {
    case 'add':
      return addStickerObjectList(stickerObjectList, payload.stickerObjectList)
    case 'remove':
      return removeStickerObjectList(
        stickerObjectList,
        payload.stickerObjectList
      )
    default:
      return stickerObjectList
  }
}

type StickerObjectListContextProvider = FC

export const StickerObjectListContextProvider: StickerObjectListContextProvider = ({
  children
}) => {
  const [stickerObjectList, stickerObjectListDispatch] = useReducer(
    stickerObjectListReducer,
    []
  )

  return (
    <StickerObjectListContext.Provider
      value={[stickerObjectList, stickerObjectListDispatch]}
    >
      {children}
    </StickerObjectListContext.Provider>
  )
}
