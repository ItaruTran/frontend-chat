import { io } from "socket.io-client";
import { transformMessage } from "@/transform/chat";

export default class WSManager {
  constructor(jwt_token) {
    this._socket = io(process.env.API_URL, {
      transports: ["websocket"],
      query: {
        jwt_token,
      },
    });
  }

  /**
   * @param {(message: import('@t/chat').Message) => void} func
   */
  listenNewMessage = (func) => {
    this._socket.on('NewMessage', data => func(transformMessage(data)))
  }
}
