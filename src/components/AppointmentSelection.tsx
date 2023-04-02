import styled from '@emotion/styled';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SectionTitle from 'components/SectionTitle';
import SpaceBetweenContainer from 'components/SpaceBetweenContainer';
import { MIN_GAP_IN_MINUTES } from 'constants/dateTime';
import dayjs, { Dayjs } from 'dayjs';
import {
  endOfWorkday,
  getAppointmentDateError,
  getAppointmentTimeError,
  getMinDate,
  isAWeekend,
  onlyAllowQuarters,
  startOfWorkday,
  stringifyMinutes
} from 'helpers/dateHelper';
import useIsAvailableTimeSlot from 'hooks/useIsAvailableTimeSlot';
import { useAppointmentStore } from 'store';

const StyledButton = styled(Button)`
  max-height: 3.5rem;
`;

const AppointmentSelection = (): JSX.Element => {
  const {
    date,
    setDay: setDate,
    setDuration,
    setTime,
    addAppointment,
    duration,
  } = useAppointmentStore();
  const isAvailableTimeSlot: boolean = useIsAvailableTimeSlot();

  const onDurationChange = (event: SelectChangeEvent) => {
    setDuration(Number(event.target.value));
  };

  const onDateChange = (day: unknown): void => setDate(day as Dayjs);
  const onTimeChange = (time: unknown): void => setTime(time as Dayjs);
  const onAddAppointment = (): void => {
    if (date && duration) {
      addAppointment({ start: date, end: date.add(duration, 'minute') });
      setDuration(0);
    }
  };
  const dateError = getAppointmentDateError(date);
  const initialTimeError = getAppointmentTimeError(date);
  const isAddEnabled: boolean = !dateError && isAvailableTimeSlot;
  const maxStartTime = date && endOfWorkday(date);
  const startOfSelectedDate = date && startOfWorkday(date);
  const now = dayjs();
  const minStartTime = startOfSelectedDate?.isBefore(now)
    ? now
    : startOfSelectedDate;

  return (
    <>
      <SectionTitle>New appointment</SectionTitle>
      <SpaceBetweenContainer>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            inputFormat="DD/MM/YYYY"
            label="Date"
            onChange={onDateChange}
            renderInput={params => (
              <TextField
                {...params}
                error={!!dateError}
                helperText={dateError}
              />
            )}
            minDate={getMinDate()}
            shouldDisableDate={isAWeekend}
            value={date}
          />
          <TimePicker
            disabled={!date}
            label="Appointment Start"
            maxTime={maxStartTime}
            minTime={minStartTime}
            onChange={onTimeChange}
            renderInput={params => (
              <TextField
                {...params}
                helperText={initialTimeError}
                error={!!initialTimeError}
              />
            )}
            shouldDisableTime={onlyAllowQuarters}
            value={date}
          />
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="appointment-duration-label">Duration</InputLabel>
              <Select
                labelId="appointment-duration-label"
                id="appointment-duration"
                value={duration + ''}
                label="Duration (min)"
                onChange={onDurationChange}
              >
                {Array.from(
                  { length: 8 },
                  (_, i) => (i + 1) * MIN_GAP_IN_MINUTES
                ).map(value => (
                  <MenuItem value={value} key={value}>
                    {stringifyMinutes(value)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </LocalizationProvider>
        <StyledButton
          onClick={onAddAppointment}
          disabled={!isAddEnabled}
          variant="contained"
        >
          Add
        </StyledButton>
      </SpaceBetweenContainer>
      {!!duration && !dateError && !isAvailableTimeSlot && (
        <FormHelperText error>Appointment is not available</FormHelperText>
      )}
    </>
  );
};

export default AppointmentSelection;
