export interface ClickMessageObject {
  type: 'click'
}

type CreateClickMessageObject = () => ClickMessageObject

export const createClickMessageObject: CreateClickMessageObject = () => ({
  type: 'click'
})
