import { ThemeProvider } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, ThemeProvider as MuiThemeProvider } from '@mui/material';
import AppointmentAvailability from 'components/AppointmentAvailability';
import AppointmentList from 'components/AppointmentList';
import AppointmentSelection from 'components/AppointmentSelection';
import Header from 'components/Header';
import { TABLET_ONLY } from 'constants/breakpoints';
import { theme } from 'theme';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 48rem;
  margin: 0 auto;
  ${TABLET_ONLY} {
    max-width: 90%;
  }
`;

const App = () => (
  <MuiThemeProvider theme={theme}>
    <ThemeProvider theme={theme}>
      <PageWrapper>
        <Header title="Appointment Manager" />
        <AppointmentSelection />
        <Box sx={{ m: '1rem' }} />
        <AppointmentAvailability />
        <Box sx={{ m: '2rem' }} />
        <AppointmentList />
      </PageWrapper>
    </ThemeProvider>
  </MuiThemeProvider>
);

export default App;
