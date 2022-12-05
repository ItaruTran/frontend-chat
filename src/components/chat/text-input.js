import { useState } from "react"
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import { useChatController } from "@/hooks/chat";

export default function TextInput({ label="Type Something", textInutH }) {
  const [data, set] = useState({
    unclock: true,
    text: ''
  })
  const c = useChatController()

  function sendM(message) {
    c.sendMessage(message)
    set({
      unclock: true,
      text: ''
    })
  }

  return <Grid container style={{ padding: '20px', height: `${textInutH}vh` }}>
    <Grid item xs={11}>
      <TextField
        label={label}
        fullWidth
        multiline
        onKeyDown={e => {
          if (data.unclock && e.key == 'Enter') {
            sendM(data.text)
            e.preventDefault();
          } else if (e.key === 'Shift') {
            set(d => ({ ...d, unclock: false }))
          }
        }}
        onKeyUp={e => {
          if (e.key === 'Shift') {
            set(d => ({ ...d, unclock: true }))
          }
        }}
        value={data.text}
        onInput={e => set(d => ({ ...d, text: e.target.value }))}
      />
    </Grid>
    <Grid xs={1} item style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Fab color="primary" size="medium" aria-label="add" onClick={() => sendM(data.text)}><SendIcon /></Fab>
    </Grid>
  </Grid>
}
