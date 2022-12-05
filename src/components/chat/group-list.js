import { useState } from 'react';
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
import { resetInfo } from '@connector/local-storage';
import userStorage from '@/hooks/user-storage';

/**
 * @param {{
 *  groups: import('@t/chat').Group[]
 *  currentGroup: import('@t/chat').Group
 *  onChoose: Function
 *  userInfo: import('@t/chat').User
 * }} param0
 */
export default function GroupList({ onChoose, groups, userInfo, currentGroup }) {
  const [open, setOpen] = useState(false)
  async function handleClose(signout) {
    if (signout) {
      resetInfo()
      window.location.reload()
    } else {
      setOpen(false)
    }
  }

  if (!currentGroup) return <div/>

  return (
    <div>
      <List>
        <ListItem>
          <ListItemText primary={userInfo.name} />
          <ListItemSecondaryAction>
            <IconButton edge="end" onClick={() => setOpen(true)}>
              <ExitToAppIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText>
            <Typography variant='subtitle2'>Friend list</Typography>
          </ListItemText>
        </ListItem>
        {Object.values(groups).map((g, index) => {
          const active = g.id === currentGroup.id
          const username = userStorage.getUser(g.friend_id).name

          const onClick = () => {
            if (!active) onChoose(g)
          }

          return <ListItem button key={index} onClick={onClick}>
            <ListItemText >
              <Typography color={active ? 'inherit' : "textSecondary"}>{username}</Typography>
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
          <Button onClick={() => handleClose(false)} color="secondary" variant="text" autoFocus>
            Disagree
          </Button>
          <Button onClick={() => handleClose(true)} color="secondary" variant="contained">
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
