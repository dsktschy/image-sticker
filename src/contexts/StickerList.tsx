import React, {
  createContext,
  Dispatch,
  FC,
  useReducer,
  useContext
} from 'react'
import { Sticker } from '../lib/Sticker'
import { addStickerList, removeStickerList } from '../lib/StickerList'

interface StickerListAction {
  payload: {
    stickerList: Sticker[]
  }
  type: 'add' | 'remove'
}

type Value = [Sticker[], Dispatch<StickerListAction>]

const StickerListContext = createContext<Value | null>(null)

export const useStickerListContext = (): Value => {
  const value = useContext(StickerListContext)
  if (!value) throw new Error('NonConsumerError')
  return value
}

const stickerListReducer = (
  stickerList: Sticker[],
  { payload, type }: StickerListAction
): Sticker[] => {
  switch (type) {
    case 'add':
      return addStickerList(stickerList, payload.stickerList)
    case 'remove':
      return removeStickerList(stickerList, payload.stickerList)
    default:
      return stickerList
  }
}

type StickerListContextProvider = FC

export const StickerListContextProvider: StickerListContextProvider = ({
  children
}) => {
  const [stickerList, stickerListDispatch] = useReducer(stickerListReducer, [])

  return (
    <StickerListContext.Provider value={[stickerList, stickerListDispatch]}>
      {children}
    </StickerListContext.Provider>
  )
}
