export interface MessageObject {
  id: number
  src: string
}

export const createMessageObject = (src: string): MessageObject => ({
  id: new Date().getTime(),
  src
})
