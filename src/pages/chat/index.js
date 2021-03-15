import { Component, createRef } from 'react';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import ChatDrawer from "@components/chat/drawer";
import { chatApi } from '@api/chat';
import { WSManager } from '@api/ws';
import Messages from '@components/chat/messages';
import { getAccessToken } from '@connector/local-storage';
import Waiting from "@components/waiting";

const drawerWidth = 270;
const topbar = 9
const textInut = 12

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    height: '100vh',
    flexGrow: 1,
  },
  messageArea: {
    height: `${100 - topbar - textInut -1}vh`,
    overflowY: 'auto'
  },
  loading: {
    display: 'flex',
  },
});

class ChatPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      friends: {},
      messages: [],
      currentFriend: null,
      mobileOpen: false,
      text: '',
      isLoading: true,
      unclock: true,
    }
    this.lastItemRef = createRef();
  }

  async componentDidMount() {
    console.log('run init');
    const friendList = await chatApi.getFriendList()
    const friends = {}

    for (const f of friendList) {
      if (f.user1_id === this.props.user.id) {
        f.user2.friendship_id = f.id
        friends[f.user2_id] = f.user2
      } else {
        f.user1.friendship_id = f.id
        friends[f.user1_id] = f.user1

      }
    }

    const currentFriend = Object.values(friends)[0].friendship_id
    const messages = await chatApi.getMessages(currentFriend)

    this._ws = new WSManager(getAccessToken())

    console.log(friends);
    this.setState({
      isLoading: false,
      messages,
      currentFriend,
      friends,
    })
  }

  render() {
    const { classes, theme } = this.props
    const drawer = <ChatDrawer
      friends={this.state.friends}
      onChoose={this._onChoose}
      userInfo={this.props.user}
      currentFriend={this.state.currentFriend}
    />
    let user
    for (const key in this.state.friends) {
      user = this.state.friends[key];
      if (user.friendship_id === this.state.currentFriend) {
        break
      }
    }

    return (
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={this._handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              {user ? user.username : ''}
          </Typography>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer} aria-label="mailbox folders">
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={this.state.mobileOpen}
              onClose={this._handleDrawerToggle}
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
        <main className={classes.content}>
          {this.state.isLoading ? <Waiting/> : this._chatUI()}
        </main>
      </div>
    )
  }

  _onChoose = async (currentFriend) => {
    console.log({currentFriend});
    this.setState({ isLoading: true })
    const messages = await chatApi.getMessages(currentFriend)

    this.setState({
      currentFriend,
      messages,
      isLoading: false,
      mobileOpen: false
    })
  }
  _handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  _chatUI(props) {
    const { classes } = this.props

    return (
      <>
        <div style={{ height: `${topbar - 1}vh` }}>
        </div>
        <Messages
          messageArea={classes.messageArea}
          data={this.state.messages}
          friends={this.state.friends}
          userId={this.props.user.id}
          currentFriend={this.state.currentFriend}
          emitter={this._ws}
        />
        <Divider />
        <Grid container style={{ padding: '20px', height: `${textInut}vh` }}>
          <Grid item xs={11}>
            <TextField
              id="outlined-basic-email"
              label="Type Something"
              fullWidth
              multiline
              onKeyDown={e => {
                if (this.state.unclock && e.key == 'Enter') {
                  this._onClick()
                } else if (e.key === 'Shift') {
                  this.setState({unclock: false})
                }
              }}
              onKeyUp={e => {
                if (e.key === 'Shift') {
                  this.setState({ unclock: true })
                }
              }}
              value={this.state.text}
              onInput={e => this.setState({ text: e.target.value })}
            />
          </Grid>
          <Grid xs={1} item align="right">
            <Fab color="primary" size="medium" aria-label="add" onClick={this._onClick}><SendIcon /></Fab>
          </Grid>
        </Grid>
      </>
    )
  }

  _onClick = async () => {
    if (this.state.text.length === 0)
      return

    const message = await chatApi.sendMessage({
      content: this.state.text,
      friendship_id: this.state.currentFriend,
    })
    this.setState({text: ''})

    this._ws.emit(`/chat/${this.state.currentFriend}`, message)
  }
  _scrollTo = (ref) => {
    if (ref /* + other conditions */) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

export default withStyles(styles, { withTheme: true })(ChatPage)
