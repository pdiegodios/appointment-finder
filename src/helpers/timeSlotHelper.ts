import { TestAppointment, TimeSlot } from 'types';

// NOTE(pdiego): This is a test only to match the description of developer challenge
export const isAppointmentOverlap = (
  a: TestAppointment,
  b: TestAppointment
): boolean => {
  const aTimeSlot: TimeSlot = {
    start: a.start,
    end: a.start.add(a.duration, 'minute'),
  };
  const bTimeSlot: TimeSlot = {
    start: b.start,
    end: b.start.add(b.duration, 'minute'),
  };

  const aStartTimeIsInBTimeSlot =
    (aTimeSlot.start.isAfter(bTimeSlot.start) ||
      aTimeSlot.start.isSame(bTimeSlot.start)) &&
    aTimeSlot.start.isBefore(bTimeSlot.end);
  const aEndTimeIsInBTimeSlot =
    (aTimeSlot.end.isBefore(bTimeSlot.end) ||
      aTimeSlot.end.isSame(bTimeSlot.end)) &&
    aTimeSlot.end.isAfter(bTimeSlot.start);

  return aStartTimeIsInBTimeSlot || aEndTimeIsInBTimeSlot;
};
