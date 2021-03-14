import { io } from "socket.io-client";
import { EventEmitter } from 'events';

export class WSManager extends EventEmitter {
  constructor(access_token) {
    super()
    this._socket = io(process.env.API_URL, {
      transports: ["websocket"],
      query: {
        access_token,
      },
    });

    this._socket.on('NewMessage', this._handleNewMessage)
  }

  /**
   * @param {import('@t/chat').Message} data
   */
  _handleNewMessage = (data) => {
    this.emit(`/chat/${data.friendship_id}`, data)
  }
}
