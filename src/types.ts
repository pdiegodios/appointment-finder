import { Dayjs } from 'dayjs';

export type TimeSlot = {
  start: Dayjs;
  end: Dayjs;
};

export type TestAppointment = {
  start: Dayjs;
  duration: number;
};
