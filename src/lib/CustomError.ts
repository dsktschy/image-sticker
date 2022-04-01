export class CustomError extends Error {
  /**
   * Whether updating extension is required
   */
  updating: boolean

  /**
   * Whether reopening default popup is required
   */
  reopening: boolean

  constructor(name: string, updating?: boolean, reopening?: boolean) {
    super(name)
    // Set message again because sendMessage method removes its properties
    this.message = this.name = name
    this.updating = typeof updating === 'boolean' ? updating : false
    this.reopening = typeof reopening === 'boolean' ? reopening : false
  }
}
