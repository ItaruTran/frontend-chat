import { BaseApi } from "./base";

class ChatApi extends BaseApi {
  /**
   * @param {{
   *  username: string
   *  password: string
   * }} data
   * @returns {Promise<import('@t/chat').AccessToken>}
   */
  login(data) {
    return this._callApi({
      method: 'POST',
      path: '/api/users/login',
      body: data,
    })
  }
  logout() {
    return this._callApi({
      needToken: true,
      method: 'POST',
      path: '/api/users/logout',
    })
  }
  /**
   * @returns {Promise<import('@t/chat').FriendList[]>}
   */
  getFriendList() {
    const query = JSON.stringify({
      include: [
        {
          relation: 'user1',
          scope: {
            fields: ['username']
          },
        },
        {
          relation: 'user2',
          scope: {
            fields: ['username']
          },
        },
      ]
    })
    return this._callApi({
      needToken: true,
      method: 'GET',
      path: `/api/friend-list`,
      query: {
        filter: query,
      }
    })
  }
  /**
   * @param {number} friendship_id
   * @param {number} offset
   * @returns {Promise<import('@t/chat').Message[]>}
   */
  getMessages(friendship_id, offset=0) {
    const query = JSON.stringify({
      where: { friendship_id },
      order: 'timestamp DESC',
      // limit: 10,
      skip: offset,
    })
    return this._callApi({
      needToken: true,
      method: 'GET',
      path: `/api/message?filter=${encodeURIComponent(query)}`,
    })
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
}

export const chatApi = new ChatApi(process.env.API_URL)
