export interface DropMessageObject {
  type: 'drop'
  payload: string
}

type CreateDropMessageObject = (src: string) => DropMessageObject

export const createDropMessageObject: CreateDropMessageObject = src => ({
  type: 'drop',
  payload: src
})
