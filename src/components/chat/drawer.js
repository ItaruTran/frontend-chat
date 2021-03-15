import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { chatApi } from '@api/chat';
import { resetInfo } from '@connector/local-storage';

/**
 * @param {{
 *  friends: any
 *  onChoose: Function
 *  userInfo: import('@t/chat').User
 * }} param0
 */
export default function ({ onChoose, friends, userInfo, currentFriend }) {
  const [open, setOpen] = useState(false)
  async function handleClose(signout) {
    if (signout) {
      await chatApi.logout()
      resetInfo()
      window.location = '/'
    } else {
      setOpen(false)
    }
  }

  return (
    <div>
    <List>
      <ListItem>
        <ListItemText primary={userInfo.username}/>
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={() => setOpen(true)}>
            <ExitToAppIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider/>
      <ListItem>
        <ListItemText>
          <Typography variant='subtitle2'>Friend list</Typography>
        </ListItemText>
      </ListItem>
      {Object.values(friends).map((user, index) => {
        const active = user.friendship_id === currentFriend
        return <ListItem button key={index} onClick={() => onChoose(user.friendship_id)}>
          <ListItemText >
            <Typography color={active ? 'inherit' : "textSecondary"}>{user.username}</Typography>
          </ListItemText>
        </ListItem>
      })}
      </List>
      <Dialog
        open={open}
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Do you want sign out?"}</DialogTitle>
        <DialogActions>
          <Button onClick={() => handleClose(true)} color="secondary">
            Agree
          </Button>
          <Button onClick={() => handleClose(false)} color="secondary"  autoFocus>
            Disagree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
