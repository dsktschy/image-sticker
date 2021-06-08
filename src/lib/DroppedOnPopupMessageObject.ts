export interface DroppedOnPopupMessageObject {
  type: 'droppedOnPopup'
  payload: string
}

type CreateDroppedOnPopupMessageObject = (
  src: string
) => DroppedOnPopupMessageObject

export const createDroppedOnPopupMessageObject: CreateDroppedOnPopupMessageObject = src => ({
  type: 'droppedOnPopup',
  payload: src
})
