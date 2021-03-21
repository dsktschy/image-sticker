import { useEffect } from 'react'
import { initializeDefaultPopup, readFileList } from '../models/DefaultPopup'

type UseDefaultPopup = () => {
  readFileList: typeof readFileList
}

export const useDefaultPopup: UseDefaultPopup = () => {
  useEffect(() => {
    return initializeDefaultPopup()
  }, [])

  return { readFileList }
}
