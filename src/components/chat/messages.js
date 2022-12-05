import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularProgress from '@material-ui/core/CircularProgress';

import Comment from '@components/chat/comment'
import userStorage from '@/hooks/user-storage';
import { useChatController } from '@/hooks/chat';

const colors = [
  '#f37272',
]

/**
 * @param {{
 *  messages: import('@t/chat').Message[]
 *  userId: string
 *  messageArea: string
 *  hasMore: boolean
 * }} param0
 */
export default function Messages({ messages, userId, messageArea, hasMore }) {
  const avatarColor = colors[0]
  const c = useChatController()

  return <List
    className={messageArea}
    id="scrollableDiv"
    style={{
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column-reverse',
    }}
  >
    <InfiniteScroll
      dataLength={messages.length}
      next={c.loadMore}
      style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
      inverse={true}
      hasMore={hasMore}
      loader={
        <div style={{ width: '100%', height: '50px', display: 'flex' }}>
          <CircularProgress style={{ margin: 'auto' }} />
        </div>
      }
      scrollableTarget="scrollableDiv"
    >
      {messages.map((message, index) => {
        const isMe = message.sender_id === userId

        let shortName = ''
        if (!isMe) {
          shortName = userStorage.getUser(message.sender_id)?.name.substring(0, 2)
        }

        return (<ListItem id={`comment-${message.id}`} key={`comment-${message.id}`}>
          <Comment
            timestamp={message.timestamp}
            text={message.content}
            isMe={isMe}
            avatarColor={avatarColor}
            shortName={shortName}
          />
        </ListItem>)
      })}
    </InfiniteScroll>
  </List>
}
