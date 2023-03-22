import { chatApi } from "@/api/chat";
import WSManager from '@/api/ws';
import userStorage from "../user-storage";

export default class GroupController {
  constructor() {
    this._haveNoti = false
    /** @type {import('@t/chat').Group[]} */
    this._groups = []
  }

  /**
   *
   * @param {string} token
   * @param {import('@t/chat').User} user
   */
  async init(token, user) {
    this._user = user
    this._ws = new WSManager(token);
    this._ws.listenNewMessage(this._handleNewMessage)

    if (!("Notification" in window)) {
      this._haveNoti = false
    } else if (Notification.permission !== "denied") {
      const self = this
      Notification.requestPermission().then(
        permission => {
          if (permission === "granted") {
            self._haveNoti = true
          }
        }
      )
    } else {
      this._haveNoti = true
    }

    await this.refreshGroups()
  }

  /**
   * @param {React.Dispatch<React.SetStateAction<
   *  typeof import('./index').defaultGroupState
   * >>} func
   */
  listenGroup(func) {
    this._setGroups = func

    func({ loading: false, groups: this._groups })
  }

  async refreshGroups () {
    const groups = await chatApi.getGroup({
      userId: this._user.id,
    })

    if(groups.length > 0){
      const users = groups.map(g => g.friend_id)
      await userStorage.addUser(users)
    }

    this._groups = groups
    this._setGroups && this._setGroups({ loading: false, groups })
  }

  /**
   * @param {(m: import('@t/chat').Message) => void} func
   * @param {import('@t/chat').Group} group
   */
  listenMessage(group, func) {
    this._currentGroup = group
    this._addNewMessage = func
  }

  /**
   * @param {import('@t/chat').Message} message
   */
  _handleNewMessage = (message) => {
    // this._groups = this._groups.filter((g, i) => {
    //   if (g.id === this._currentGroup.id) {
    //     return false
    //   } else
    //     return true
    // })

    // this._groups.unshift({
    //   ...this._currentGroup,
    //   last_message_time: message.timestamp
    // })

    // this._setGroups({ groups: this._groups, loading: false })

    if (message.group_id === this._currentGroup.id) {
      this._addNewMessage(message)
    } else if (this._haveNoti) {
      new Notification(this._currentGroup.name, {
        body: message.content
      })
    }
  }
}
