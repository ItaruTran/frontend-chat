import { chatApi } from "@/api/chat";

export default class ChatController {
  /**
   * @param {import('@t/chat').Group} group
   */
  constructor(group) {
    this._offset = 0
    this._limit = 15
    this._group = group
  }

  /**
   * @param {React.Dispatch<React.SetStateAction<
   *  typeof import('./index').defaultChatState
   *>>} func
   */
  listenChange(func) {
    this._updater = func
  }

  get _update() {
    if (this._updater)
      return this._updater

    return () => { }
  }

  get group() {
    return this._group
  }

  async _getMessages() {
    const result = await chatApi.getMessages(this._group.id, {
      offset: this._offset,
      limit: this._limit,
    });

    this._offset += result.length

    return result
  }

  async refreshChat() {
    this._update(s => ({ ...s, isLoading: true }))

    this._offset = 0

    const result = await this._getMessages()

    const hasMore = result.length === this._limit

    this._update({ isLoading: false, messages: result, hasMore })
  }

  loadMore = async () => {
    // this._update(s => ({ ...s, isLoading: true }))

    const result = await this._getMessages()

    const hasMore = result.length === this._limit

    this._update(s => ({
      isLoading: false,
      messages: [
        ...s.messages,
        ...result
      ],
      hasMore
    }))
  }

  async sendMessage(content) {
    const result = await chatApi.sendMessage({
      group_id: this._group.id,
      content
    })

    this.addMessage(result)
  }

  addMessage = (message) => {
    this._update(s => {
      return {
        ...s,
        messages: [
          message,
          ...s.messages,
        ]
      }
    })
  }
}