import { chatApi } from '@/api/chat';

class UserStorage {
  constructor() {
    /** @type {Map<string, import('@t/chat').User>} */
    this._storage = new Map();
  }

  /**
   * @param {string[]} ids
   */
  async addUser(ids) {
    const list = []
    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];

      if (!this._storage.has(id)) {
        list.push(id)
      }
    }

    const result = await chatApi.getUserInfo(list)

    for (let index = 0; index < result.length; index++) {
      const user = result[index];
      this._storage.set(user.id, user)
    }
  }

  /**
   * @param {string} id
   */
  getUser(id) {
    const user = this._storage.get(id);
    if (!user) console.log('Not found', id);
    return user
  }
}

const userStorage = new UserStorage()
export default userStorage
