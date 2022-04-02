export class CustomError extends Error {
  constructor(message: string) {
    super(message)
    // Avoid to be removed by sendMessage method
    Object.defineProperty(this, 'message', { enumerable: true })
  }
}
