import { Dayjs } from 'dayjs';
import {
  getClosestTimeSlot,
  getMinDate,
  startOfWorkday,
} from 'helpers/dateHelper';
import { TimeSlot } from 'types';
import { create } from 'zustand';

type Store = {
  appointments: TimeSlot[];
  date: Dayjs | null;
  duration: number;
  addAppointment: (appointment: TimeSlot) => void;
  deleteAppointment: (appointment: TimeSlot) => void;
  setDay: (date: Dayjs) => void;
  setDuration: (duration: number) => void;
  setTime: (date: Dayjs) => void;
};

const byStartTime = (a: TimeSlot, b: TimeSlot) =>
  a.start.isBefore(b.start) ? -1 : 1;

export const useAppointmentStore = create<Store>(set => {
  const nextPossibleSlot = getClosestTimeSlot();
  const initialDate = getMinDate(nextPossibleSlot);
  return {
    appointments: [],
    currentAppointment: {},
    date: initialDate,
    duration: 0,
    setDuration: (duration: number) => set(() => ({ duration })),
    setDay: (day: Dayjs | null) => {
      set(({ date }) => {
        if (date && day) {
          return {
            date: date
              .set('year', day.year())
              .set('month', day.month())
              .set('date', day.date()),
          };
        }
        return {
          date: day ? startOfWorkday(day) : null,
        };
      });
    },
    setTime: (time: Dayjs | null) => {
      set(({ date }) => {
        if (date && time) {
          return {
            date: date
              .set('hour', time?.hour() || 0)
              .set('minute', time?.minute() || 0),
          };
        }
        return { date };
      });
    },
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
