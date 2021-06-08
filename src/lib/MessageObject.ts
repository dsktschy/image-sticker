import { PopupClickedMessageObject } from '~/lib/PopupClickedMessageObject'
import { DroppedOnPopupMessageObject } from '~/lib/DroppedOnPopupMessageObject'
import { PopupOpenedMessageObject } from '~/lib/PopupOpenedMessageObject'

export type MessageObject =
  | PopupClickedMessageObject
  | DroppedOnPopupMessageObject
  | PopupOpenedMessageObject
