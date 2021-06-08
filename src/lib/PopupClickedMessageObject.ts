export interface PopupClickedMessageObject {
  type: 'popupClicked'
}

type CreatePopupClickedMessageObject = () => PopupClickedMessageObject

export const createPopupClickedMessageObject: CreatePopupClickedMessageObject = () => ({
  type: 'popupClicked'
})
