export interface DropMessageObject {
  type: 'drop'
  payload: {
    id: number
    src: string
    [key: string]: unknown
  }
}

type CreateDropMessageObject = (props: {
  src: string
  [key: string]: unknown
}) => DropMessageObject

export const createDropMessageObject: CreateDropMessageObject = props => ({
  type: 'drop',
  payload: {
    id: new Date().getTime(),
    ...props
  }
})