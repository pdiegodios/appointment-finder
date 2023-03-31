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
  TextField,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SectionTitle from 'components/SectionTitle';
import SpaceBetweenContainer from 'components/SpaceBetweenContainer';
import { MIN_GAP_IN_MINUTES } from 'constants/dateTime';
import { Dayjs } from 'dayjs';
import {
  getAppointmentDateError,
  getMinDate,
  isAWeekend,
  stringifyMinutes,
} from 'helpers/dateHelper';
import useGetAvailableTimeSlots from 'hooks/useGetAvailableTimeSlots';
import { useMemo } from 'react';
import { useAppointmentStore } from 'store';
import { TimeSlot } from 'types';

const StyledButton = styled(Button)`
  max-height: 3.5rem;
`;

const AppointmentSelection = (): JSX.Element => {
  const { date, setDate, setDuration, addAppointment, duration } =
    useAppointmentStore();
  const availableTimeSlots: TimeSlot[] = useGetAvailableTimeSlots();
  const end: Dayjs = useMemo(
    () => date.add(duration, 'minute'),
    [date, duration]
  );

  const onDurationChange = (event: SelectChangeEvent) => {
    setDuration(Number(event.target.value));
  };

  const onDateChange = (day: unknown): void => setDate(day as Dayjs);
  const onAddAppointment = (): void => {
    if (duration) {
      addAppointment({ start: date, end });
      setDuration(0);
    }
  };
  const dateError = getAppointmentDateError(date);
  const isAvailableSlot: boolean = useMemo(() => {
    if (!duration || dateError) return false;
    return !!availableTimeSlots.find(t => {
      const matchStart: boolean =
        t.start.isBefore(date) || t.start.isSame(date);
      const matchEnd: boolean = t.end.isAfter(end) || t.end.isSame(end);
      return matchStart && matchEnd;
    });
  }, [end, availableTimeSlots, date]);
  const isAddEnabled: boolean = !!duration && !dateError && isAvailableSlot;

  return (
    <>
      <SectionTitle>New appointment</SectionTitle>
      <SpaceBetweenContainer>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            inputFormat="DD/MM/YYYY HH:mm"
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
      {!!duration && !dateError && !isAvailableSlot && (
        <FormHelperText error>Appointment is not available</FormHelperText>
      )}
    </>
  );
};

export default AppointmentSelection;
