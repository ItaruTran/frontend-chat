import { useEffect, useState } from 'react'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import Comment from '@components/chat/comment'

const colors = [
  '#f37272',
]

/**
 * @param {{
 *  data: import('@t/chat').Message[]
 *  currentFriend: number
 *  userId: number
 *  messageArea: string
 *  friends: {[k: string]: import('@t/chat').User}
 *  emitter: import('events').EventEmitter
 * }} param0
 */
export default function Messages({ data, currentFriend, userId, messageArea, friends, emitter }) {
  const [messages, setMessages] = useState(data)
  const avatarColor = colors[Math.floor(Math.random() * (colors.length - 1))]

  useEffect(() => {
    function update(message) {
      setMessages(messages => {
        return [message, ...messages]
      })
    }
    emitter.on(`/chat/${currentFriend}`, update)

    return () => {
      emitter.removeListener(`/chat/${currentFriend}`, update)
    }
  })

  return <List className={messageArea}>
    {messages.map((message, index) => {
      const isMe = message.sender_id===userId
      return (<ListItem key={`comment-${index}`}>
        <Comment
          key={`comment-${index}`}
          timestamp={message.timestamp}
          text={message.content}
          isMe={isMe}
          avatarColor={avatarColor}
          shortName={!isMe ? friends[message.sender_id].username.substring(0, 2) : ''}
        />
      </ListItem>)
    }).reverse()}
  </List>
}
