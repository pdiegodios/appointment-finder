import dayjs, { Dayjs } from 'dayjs';
import { addWorkdays, endOfWorkday, startOfWorkday } from 'helpers/dateHelper';
import { TimeSlot } from 'types';
import { create } from 'zustand';

type Store = {
  appointments: TimeSlot[];
  date: Dayjs;
  duration: number;
  addAppointment: (appointment: TimeSlot) => void;
  deleteAppointment: (appointment: TimeSlot) => void;
  setDate: (date: Dayjs) => void;
  setDuration: (duration: number) => void;
};

const byStartTime = (a: TimeSlot, b: TimeSlot) =>
  a.start.isBefore(b.start) ? -1 : 1;

export const useAppointmentStore = create<Store>(set => {
  const now = dayjs();
  const initialDate = now.isAfter(endOfWorkday(now))
    ? startOfWorkday(addWorkdays(now, 1))
    : now;
  return {
    appointments: [],
    currentAppointment: {},
    date: initialDate.set('seconds', 0).set('millisecond', 0),
    duration: 0,
    setDuration: (duration: number) => set(() => ({ duration })),
    setDate: (date: Dayjs) =>
      set(() => ({ date: date.set('seconds', 0).set('milliseconds', 0) })),
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
