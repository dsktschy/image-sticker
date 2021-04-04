import { readFileList } from '../models/DefaultPopup'

type UseDefaultPopup = () => {
  readFileList: typeof readFileList
}

export const useDefaultPopup: UseDefaultPopup = () => {
  return { readFileList }
}
