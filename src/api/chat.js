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
      path: `/api/friendship/`,
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
    const query = {
      filter: JSON.stringify({ friendship_id }),
      order: 'timestamp DESC',
      // limit: 10,
      offset,
    }
    return this._callApi({
      needToken: true,
      method: 'GET',
      path: `/api/message/`,
      query,
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
      path: '/api/message/',
      body,
    })
  }
  /**
   * @param {number} id
   * @returns {Promise<import('@t/chat').User>}
   */
  getInfo(id) {
    return this._callApi({
      needToken: true,
      method: 'GET',
      path: `/api/users/${id}`,
    })
  }
}

export const chatApi = new ChatApi(process.env.API_URL)
