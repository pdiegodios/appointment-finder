import { createTheme, Theme } from '@mui/material/styles';

export const theme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#084C7C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F0F3F9',
      contrastText: '#084C7C',
    },
  },
});
