import "core-js/stable";
import "regenerator-runtime/runtime";

import { StrictMode, useMemo } from 'react';
import ReactDOM from 'react-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import App from './app'

const render = () => {
  ReactDOM.render(
    <StrictMode>
      <Root />
    </StrictMode>,
    document.getElementById('root')
  );
};

function Root() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
}

render();
