import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import ChatDrawer from "@components/chat/drawer";
import { ContextChat } from '@/hooks/chat';
import ChatUI from '@/components/chat';

const drawerWidth = 270;
const topbar = 9
const textInut = 12

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    height: '100vh',
    flexGrow: 1,
  },
  messageArea: {
    height: `${100 - topbar - textInut - 2}vh`,
  },
}));

/**
 * @type {{
 * group?: import('@t/chat').Group
 * }}
 */
const defaultState = {
  group: null,
};

export default function ChatPage({ user }) {
  const [state, set] = useState(defaultState);

  const classes = useStyles()

  function chooseGroup(group) {
    set(s => ({ ...s, group }))
  }

  return (
    <div className={classes.root}>
      <ChatDrawer
        drawerWidth={drawerWidth}
        chooseGroup={chooseGroup}
        userInfo={user}
        currentGroup={state.group}
      />
      <main className={classes.content}>
        {state.group && <ContextChat group={state.group}>
          <ChatUI
            textInutH={textInut}
            topbarH={topbar}
            messageArea={classes.messageArea}
            userId={user.id} />
        </ContextChat>}
      </main>
    </div>
  )
}
