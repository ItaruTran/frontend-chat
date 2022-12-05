import { useEffect, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import userStorage from '@/hooks/user-storage';
import { useGroupChat } from '@/hooks/chat';
import GroupList from './group-list';

const useStyles = makeStyles((theme) => ({
  appBar: ({ drawerWidth }) => ({
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  }),
  drawer: ({ drawerWidth }) => ({
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  }),
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  drawerPaper: ({ drawerWidth }) => ({
    width: drawerWidth,
  }),
}));

/**
 * @type {{
 * mobileOpen: boolean
 * }}
 */
const defaultState = {
  mobileOpen: false
};

/**
 * @param {{
 *  chooseGroup: (g: import('@t/chat').Group) => void
 *  currentGroup: import('@t/chat').Group
 *  userInfo: import('@t/chat').User
 *  drawerWidth: number
 * }} param0
 */
export default function ChatDrawer({ chooseGroup, userInfo, currentGroup, drawerWidth }) {
  const theme = useTheme()
  const classes = useStyles({ drawerWidth })

  const { groups } = useGroupChat()
  const [state, set] = useState(defaultState);

  useEffect(() => {
    if (groups) chooseGroup(groups[0])
  }, [groups])

  function _handleDrawerToggle() {
    set(s => ({ ...s, mobileOpen: !state.mobileOpen }));
  }

  const drawer = <GroupList
    groups={groups}
    onChoose={chooseGroup}
    userInfo={userInfo}
    currentGroup={currentGroup}
  />

  let username = currentGroup ? userStorage.getUser(currentGroup.friend_id).name : ''

  return <>
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={_handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          {username}
        </Typography>
      </Toolbar>
    </AppBar>
    <nav className={classes.drawer} aria-label="mailbox folders">
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={state.mobileOpen}
          onClose={_handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  </>
}
