import React, {
  createContext,
  Dispatch,
  FC,
  useReducer,
  useContext
} from 'react'
import { StickerObject } from '../lib/StickerObject'
import {
  addToStickerObjectList,
  removeFromStickerObjectList,
  updateInStickerObjectList
} from '../lib/StickerObjectList'

interface StickerObjectListAction {
  payload: StickerObject
  type: 'add' | 'remove' | 'update'
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
      return addToStickerObjectList(stickerObjectList, payload)
    case 'remove':
      return removeFromStickerObjectList(stickerObjectList, payload)
    case 'update':
      return updateInStickerObjectList(stickerObjectList, payload)
    default:
      throw new Error('InvalidActionTypeError')
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
