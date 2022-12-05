import Divider from '@material-ui/core/Divider';
import Messages from '@components/chat/messages';
import TextInput from "./text-input";
import Waiting from "@components/waiting";
import { useChat } from '@/hooks/chat';

export default function ChatUI({ textInutH, topbarH, messageArea, userId }) {
  const state = useChat()

  if (state.isLoading) return <Waiting/>;

  return (
    <>
      <div style={{ height: `${topbarH}vh` }}>
      </div>
      <Messages
        hasMore={state.hasMore}
        messageArea={messageArea}
        messages={state.messages}
        userId={userId}
      />
      <Divider />
      <TextInput textInutH={textInutH} />
    </>
  )
}
