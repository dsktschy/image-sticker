import React, {
  createContext,
  Dispatch,
  FC,
  useReducer,
  useContext
} from 'react'
import { CustomError } from '~/lib/CustomError'
import { StickerObject } from '~/lib/StickerObject'
import {
  addToStickerObjectList,
  bringToFrontOfStickerObjectList,
  removeFromStickerObjectList
} from '~/lib/StickerObjectList'

interface StickerObjectListAction {
  payload: StickerObject
  type: 'ADD' | 'REMOVE' | 'BRING_TO_FRONT'
}

type Value = [StickerObject[], Dispatch<StickerObjectListAction>]

const StickerObjectListContext = createContext<Value | null>(null)

export const useStickerObjectListContext = (): Value => {
  const value = useContext(StickerObjectListContext)
  if (!value) throw new CustomError('NonConsumerError')
  return value
}

const stickerObjectListReducer = (
  stickerObjectList: StickerObject[],
  { payload, type }: StickerObjectListAction
): StickerObject[] => {
  switch (type) {
    case 'ADD':
      return addToStickerObjectList(stickerObjectList, payload)
    case 'REMOVE':
      return removeFromStickerObjectList(stickerObjectList, payload)
    case 'BRING_TO_FRONT':
      return bringToFrontOfStickerObjectList(stickerObjectList, payload)
    default:
      throw new CustomError('InvalidActionTypeError')
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
