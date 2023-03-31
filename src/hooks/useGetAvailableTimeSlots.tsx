import { Dayjs } from 'dayjs';
import { workdayRange } from 'helpers/dateHelper';
import { splitTimeSlotByWorkday } from 'helpers/timeSlotHelper';
import { useAppointmentStore } from 'store';
import { TimeSlot } from 'types';

const timeGap = ({ start, end }: TimeSlot): number =>
  end.diff(start, 'minutes');

const RANGE_LENGTH = 5;

const useGetAvailableTimeSlots = (): TimeSlot[] => {
  const { appointments, currentAppointment } = useAppointmentStore();
  if (!currentAppointment.end || !currentAppointment.start) return [];
  const duration = timeGap({
    start: currentAppointment.start,
    end: currentAppointment.end,
  });
  const sevenDaysRange: TimeSlot = workdayRange(
    currentAppointment.start,
    RANGE_LENGTH
  );
  const currentAppointmentsInRange = appointments.filter(
    (a: TimeSlot) =>
      a.start.isAfter(sevenDaysRange.start) &&
      a.end.isBefore(sevenDaysRange.end)
  );
  const limitTimeslot = { start: sevenDaysRange.end, end: sevenDaysRange.end };
  const takenAppointments = [...currentAppointmentsInRange, limitTimeslot];
  return takenAppointments
    .reduce(
      (
        result: TimeSlot[],
        current: TimeSlot,
        index: number,
        all: TimeSlot[]
      ) => {
        const previousAppointmentEnd: Dayjs | undefined = all[index - 1]?.end;
        const start = previousAppointmentEnd || sevenDaysRange.start;
        const end = current.start;
        const timeslot = { start, end };
        return [...result, ...splitTimeSlotByWorkday(timeslot)];
      },
      []
    )
    .filter(slot => timeGap(slot) >= duration);
};

export default useGetAvailableTimeSlots;
