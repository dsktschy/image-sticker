import { PopupClickedMessageObject } from '~/lib/PopupClickedMessageObject'
import { DroppedOnPopupMessageObject } from '~/lib/DroppedOnPopupMessageObject'

export type MessageObject =
  | PopupClickedMessageObject
  | DroppedOnPopupMessageObject
