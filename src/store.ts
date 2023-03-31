import dayjs, { Dayjs } from 'dayjs';
import {
  addWorkdays,
  endOfWorkday,
  nextTimeFraction,
  startOfWorkday,
} from 'helpers/dateHelper';
import { TimeSlot } from 'types';
import { create } from 'zustand';

type Store = {
  appointments: TimeSlot[];
  currentAppointment: Partial<TimeSlot>;
  date: Dayjs;
  addAppointment: (appointment: TimeSlot) => void;
  deleteAppointment: (appointment: TimeSlot) => void;
  setDate: (date: Dayjs) => void;
  setEndTime: (end: Dayjs) => void;
  setInitialTime: (start: Dayjs) => void;
};

const byStartTime = (a: TimeSlot, b: TimeSlot) =>
  a.start.isBefore(b.start) ? -1 : 1;

export const useAppointmentStore = create<Store>(set => {
  const now = dayjs();
  const date = now.isAfter(endOfWorkday(now))
    ? startOfWorkday(addWorkdays(now, 1))
    : now;
  return {
    appointments: [],
    currentAppointment: {},
    date,
    setInitialTime: (start: Dayjs) =>
      set(({ currentAppointment }) => {
        const realStart = date
          .set('hour', start.hour())
          .set('minute', start.minute());
        return {
          currentAppointment: {
            start: realStart,
            end: currentAppointment.end?.isBefore(realStart)
              ? nextTimeFraction(realStart)
              : currentAppointment.end,
          },
        };
      }),
    setDate: (date: Dayjs) =>
      set(({ currentAppointment }) => ({
        date,
        currentAppointment: {
          start: currentAppointment.start?.add(
            date.diff(currentAppointment.start, 'day'),
            'day'
          ),
          end: currentAppointment.end?.add(
            date.diff(currentAppointment.end, 'day'),
            'day'
          ),
        },
      })),
    setEndTime: (end: Dayjs) =>
      set(({ currentAppointment }) => {
        const realEnd = date
          .set('hour', end.hour())
          .set('minute', end.minute());
        return {
          currentAppointment: {
            ...currentAppointment,
            end: realEnd,
          },
        };
      }),
    addAppointment: (newAppointment: TimeSlot) =>
      set(({ appointments }) => ({
        appointments: [...appointments, newAppointment].sort(byStartTime),
        currentAppointment: {},
      })),
    deleteAppointment: (appointment: TimeSlot) =>
      set(({ appointments }) => ({
        appointments: appointments.filter(a => a !== appointment),
      })),
  };
});
