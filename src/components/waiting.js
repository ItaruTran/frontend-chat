import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function (props) {
  return <Grid
    container
    direction="row"
    justify="center"
    alignItems="center"
    style={{
      height: '100%',
      display: 'flex',
    }}
  >
    <Grid item>
      <CircularProgress />
    </Grid>
  </Grid>
}
