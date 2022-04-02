export class CustomError extends Error {
  constructor(message: string) {
    // Use name property instead of message property
    // because it will be removed by sendMessage method
    super(message)
    this.name = message
  }
}
