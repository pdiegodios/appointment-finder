import { DATE_FORMAT, TIME_FORMAT } from 'constants/dateTime';
import { addWorkdays, endOfWorkday, startOfWorkday } from 'helpers/dateHelper';
import { TestAppointment, TimeSlot } from 'types';

/**
 * NOTE(pdiego): This function is only used to match the shape of the developer challenge but not really used
 * @param a Appointment containing start time and duration
 * @param b Appointment containing start time and duration
 * @returns true when appointments overlap one with each other, false otherwise
 */
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

/**
 * @param timeSlot
 * @param format optional. Defaults to HH:mm
 * @returns `startDateFormatted` - `endDateFormatted`
 */
export const stringifyTimeSlotTime = (
  { start, end }: TimeSlot,
  format = TIME_FORMAT
) => {
  const startFormat: string = start.format(format);
  const endFormat: string = end.format(format);
  return `${startFormat} - ${endFormat}`;
};

/**
 * @param timeSlot
 * @param format optional. Defaults to DD/MM/YYYY
 * @returns Day formatted
 */
export const stringifyTimeSlotDay = (
  { start }: TimeSlot,
  format = DATE_FORMAT
): string => start.format(format);

/**
 * Simple stringification of a TimeSlot for UX purposes
 * @param timeSlot
 * @returns a human readable information about the timeslot
 */
export const stringifyTimeSlot = (timeSlot: TimeSlot) =>
  `Date: ${stringifyTimeSlotDay(timeSlot)} | Time: ${stringifyTimeSlotTime(
    timeSlot
  )}`;

/**
 *
 * @param timeSlot a TimeSlot that can be start and end in different days
 * @returns a list of timeslots taking in account the Start and end of the business day
 */
export const splitTimeSlotByWorkday = ({
  start,
  end,
}: TimeSlot): TimeSlot[] => {
  let currentStart = start;
  let result: TimeSlot[] = [];
  while (end.diff(currentStart, 'day') > 0) {
    result = [
      ...result,
      { start: currentStart, end: endOfWorkday(currentStart) },
    ];
    currentStart = startOfWorkday(addWorkdays(currentStart, 1));
  }
  return [...result, { start: currentStart, end }];
};
