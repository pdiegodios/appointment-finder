import dayjs from 'dayjs';
import { TimeSlot } from 'types';
import { create } from 'zustand';

export type Store = {
  appointments: TimeSlot[];
  deleteAppointment: (appointment: TimeSlot) => void;
};

const mockedAppointments = [
  {
    start: dayjs().add(20, 'minute'),
    end: dayjs().add(120, 'minute'),
  },
];

export const useAppointmentStore = create<Store>(set => ({
  appointments: mockedAppointments,
  deleteAppointment: (appointment: TimeSlot) =>
    set(({ appointments }) => ({
      appointments: appointments.filter(a => a !== appointment),
    })),
}));
