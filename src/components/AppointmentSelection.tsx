import styled from '@emotion/styled';
import { Button, FormHelperText, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import SectionTitle from 'components/SectionTitle';
import SpaceBetweenContainer from 'components/SpaceBetweenContainer';
import dayjs, { Dayjs } from 'dayjs';
import {
  endOfWorkday,
  getAppointmentDateError,
  getAppointmentTimeError,
  isAWeekend,
  nextTimeFraction,
  onlyAllowQuarters,
  startOfWorkday,
} from 'helpers/dateHelper';
import useGetAvailableTimeSlots from 'hooks/useGetAvailableTimeSlots';
import { useMemo } from 'react';
import { useAppointmentStore } from 'store';
import { TimeSlot } from 'types';

const StyledButton = styled(Button)`
  max-height: 3.5rem;
`;

const AppointmentSelection = (): JSX.Element => {
  const {
    date,
    setDate,
    addAppointment,
    setInitialTime,
    setEndTime,
    currentAppointment,
  } = useAppointmentStore();
  const availableTimeSlots: TimeSlot[] = useGetAvailableTimeSlots();

  const { start: initialTime, end: endTime } = currentAppointment;
  const isComplete: boolean = !!(initialTime && endTime);
  const now = dayjs();
  const onDateChange = (day: unknown): void => setDate(day as Dayjs);
  const onInitialTimeChange = (fromTime: unknown): void =>
    setInitialTime(fromTime as Dayjs);
  const onEndTimeChange = (toTime: unknown) => setEndTime(toTime as Dayjs);
  const onAddAppointment = (): void => {
    if (initialTime && endTime) {
      addAppointment({ start: initialTime, end: endTime });
    }
  };
  const isAvailableSlot: boolean = useMemo(() => {
    if (!isComplete) return false;
    return !!availableTimeSlots.find(({ start, end }) => {
      const matchStart: boolean =
        start.isBefore(currentAppointment.start) ||
        start.isSame(currentAppointment.start);
      const matchEnd: boolean =
        end.isAfter(currentAppointment.end) ||
        end.isSame(currentAppointment.end);
      return matchStart && matchEnd;
    });
  }, [currentAppointment, availableTimeSlots, isComplete]);
  const isAddEnabled: boolean = !!currentAppointment && isAvailableSlot;
  const dateError = getAppointmentDateError(date);
  const initialTimeError = getAppointmentTimeError(initialTime);
  const endTimeIsNotAfter = !!endTime && !endTime?.isAfter(initialTime);
  const endTimeError = endTimeIsNotAfter
    ? 'End has to be after start'
    : getAppointmentTimeError(endTime);
  const startOfSelectedDate = date && startOfWorkday(date);
  const minStartTime = startOfSelectedDate.isBefore(now)
    ? now
    : startOfWorkday(date);
  const maxStartTime = date && endOfWorkday(date);
  const minEndTime = initialTime && nextTimeFraction(initialTime);
  const maxEndTime = date && endOfWorkday(date);
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
            minDate={now}
            shouldDisableDate={isAWeekend}
            value={date}
          />
          <TimePicker
            disabled={!date}
            label="Appointment Start"
            maxTime={maxStartTime}
            minTime={minStartTime}
            onChange={onInitialTimeChange}
            renderInput={params => (
              <TextField
                {...params}
                helperText={initialTimeError}
                error={!!initialTimeError}
              />
            )}
            shouldDisableTime={onlyAllowQuarters}
            value={initialTime || null}
          />
          <TimePicker
            disabled={!initialTime}
            label="Appointment End"
            maxTime={maxEndTime}
            minTime={minEndTime}
            onChange={onEndTimeChange}
            renderInput={params => (
              <TextField
                {...params}
                helperText={endTimeError}
                error={!!endTimeError}
              />
            )}
            shouldDisableTime={onlyAllowQuarters}
            value={endTime || null}
          />
        </LocalizationProvider>
        <StyledButton
          onClick={onAddAppointment}
          disabled={!isAddEnabled}
          variant="contained"
        >
          Add
        </StyledButton>
      </SpaceBetweenContainer>
      {isComplete && !isAvailableSlot && (
        <FormHelperText error>Appointment is not available</FormHelperText>
      )}
    </>
  );
};

export default AppointmentSelection;
