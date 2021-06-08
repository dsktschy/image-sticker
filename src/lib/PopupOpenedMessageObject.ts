export interface PopupOpenedMessageObject {
  type: 'popupOpened'
}

type CreatePopupOpenedMessageObject = () => PopupOpenedMessageObject

export const createPopupOpenedMessageObject: CreatePopupOpenedMessageObject = () => ({
  type: 'popupOpened'
})
