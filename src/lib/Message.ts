export interface Message {
  id: number
  src: string
}

export const createMessage = (src: string): Message => ({
  id: new Date().getTime(),
  src
})
