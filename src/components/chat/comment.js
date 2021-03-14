import { makeStyles, useTheme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import moment from 'moment'

const useStyles = makeStyles({
  circle: {
    display: 'flex',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
  },
  name: {
    maxWidth: '100%',
    margin: 'auto',
  },
  message: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 8,
    paddingLeft: 8,
    whiteSpace: 'pre-line',
  },
  content: {
    alignItems: 'left',
    maxWidth: '100%',
  },
  right: {
    justifyContent: 'flex-end !important'
  },
  left: {
    justifyContent: 'flex-start !important'
  },
})

export default function ({ shortName, isMe, avatarColor, timestamp, text }) {
  const theme = useTheme()
  const classes = useStyles()
  const align = isMe ? "right" : 'left'

  const content = (
    <Grid id='comment' container direction="column">
      <Grid item xs={6} className={classes.content}>
        <Typography align={align} variant="body2" color="textSecondary">{moment(timestamp).format('lll')}</Typography>
      </Grid>
      <Grid item xs={6} className={classes.content}>
        <Paper elevation={4} style={{ backgroundColor: theme.palette.action.hover }}>
          <Typography align={align} className={classes.message}>{text}</Typography>
        </Paper>
      </Grid>
    </Grid>
  )
  const avatar = <ListItemAvatar>
    <div className={classes.circle} style={{ backgroundColor: avatarColor }}>
      <Typography align="center" className={classes.name}>{shortName}</Typography>
    </div>
  </ListItemAvatar>

  const container = [content]
  if (isMe) {
    // container.push(avatar)
    return content
  } else {
    container.unshift(avatar)
  }

  return (
    <>
      {container}
    </>
  )
}
