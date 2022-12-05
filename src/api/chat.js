import { transformGroup, transformMessage } from "@/transform/chat";
import { BaseApi } from "./base";

class ChatApi extends BaseApi {
  /**
   * @param {{
   *  name: string
   *  password?: string
   * }} data
   * @returns {Promise<import('@t/chat').AuthUser>}
   */
  login(data) {
    return this._callApi({
      method: 'POST',
      path: '/api/users',
      body: data,
    })
  }
  /**
   * @param {string[]} ids
   * @returns {Promise<import('@t/chat').User[]>}
   */
  getUserInfo(ids) {
    return this._callApi({
      needToken: true,
      method: 'GET',
      query: { ids },
      path: `/api/users`,
    })
  }

  /**
   * @param {number} group_id
   * @param {{
   * offset?: number
   * limit?: number
   * after_time?: Date
   * before_time?: Date
   * }} opts
   * @returns {Promise<import('@t/chat').Message[]>}
   */
  async getMessages(group_id, { offset=0, limit=15, after_time, before_time }) {
    const query = {
      filter: JSON.stringify({ group_id }),
      order: 'timestamp DESC',
      limit,
      offset,
      after_time,
      before_time,
    }
    const result = await this._callApi({
      needToken: true,
      method: 'GET',
      path: `/api/message`,
      query
    });

    return result.map(
      m => transformMessage(m)
    )
  }
  /**
   * @param {import('@t/chat').MessageInput} body
   * @returns {Promise<import('@t/chat').Message>}
   */
  sendMessage(body) {
    return this._callApi({
      needToken: true,
      method: 'POST',
      path: '/api/message',
      body,
    })
  }

  /**
   * @returns {Promise<import('@t/chat').Group[]>}
   */
  async getGroup({ offset=0, limit=15, userId }) {
    const result = await this._callApi({
      needToken: true,
      method: 'GET',
      path: `/api/group-chat`,
      query: {
        order: 'last_message_time DESC',
        offset,
        limit
      }
    });

    return result.map(
      g => transformGroup(userId, g)
    )
  }

  /**
   * @param {import('@t/chat').GroupInput} body
   * @returns {Promise<import('@t/chat').Group>}
   */
  createChat(body) {
    return this._callApi({
      needToken: true,
      method: 'POST',
      path: '/api/message',
      body,
    })
  }
}

export const chatApi = new ChatApi(process.env.API_URL)
