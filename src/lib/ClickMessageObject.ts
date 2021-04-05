export interface ClickMessageObject {
  type: 'click'
  payload: {
    [key: string]: unknown
  }
}

type CreateClickMessageObject = (props: {
  [key: string]: unknown
}) => ClickMessageObject

export const createClickMessageObject: CreateClickMessageObject = props => ({
  type: 'click',
  payload: {
    ...props
  }
})
