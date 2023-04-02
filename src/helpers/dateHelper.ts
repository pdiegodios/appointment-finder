import {
  CLOSING_TIME,
  MIN_GAP_IN_MINUTES,
  OPENING_TIME,
  WEEKDAY
} from 'constants/dateTime';
import dayjs, { Dayjs } from 'dayjs';
import { TimeSlot } from 'types';

const getWeekday = (date: Dayjs): WEEKDAY => {
  switch (date.day()) {
    case 0:
      return WEEKDAY.SUNDAY;
    case 1:
      return WEEKDAY.MONDAY;
    case 2:
      return WEEKDAY.TUESDAY;
    case 3:
      return WEEKDAY.WEDNESDAY;
    case 4:
      return WEEKDAY.THURSDAY;
    case 5:
      return WEEKDAY.FRIDAY;
    default:
      return WEEKDAY.SATURDAY;
  }
};

const daysToNextWorkDay = (date: Dayjs) => {
  switch (getWeekday(date)) {
    case WEEKDAY.FRIDAY:
      return 3;
    case WEEKDAY.SATURDAY:
      return 2;
    default:
      return 1;
  }
};

const daysFromPreviousWorkDay = (date: Dayjs) => {
  switch (getWeekday(date)) {
    case WEEKDAY.MONDAY:
      return 3;
    case WEEKDAY.SUNDAY:
      return 2;
    default:
      return 1;
  }
};

export const previousWorkday = (date: Dayjs): Dayjs =>
  date.subtract(daysFromPreviousWorkDay(date), 'day');
export const nextWorkday = (date: Dayjs): Dayjs =>
  date.add(daysToNextWorkDay(date), 'day');
export const startOfWorkday = (date: Dayjs): Dayjs =>
  date.set('hour', OPENING_TIME).set('minute', 0);
export const endOfWorkday = (date: Dayjs): Dayjs =>
  date.set('hour', CLOSING_TIME).set('minute', 0);
export const isAWeekend = (date: Dayjs | null): boolean =>
  !!date && [WEEKDAY.SATURDAY, WEEKDAY.SUNDAY].includes(getWeekday(date));
const isBeforeBusinessHours = (date: Dayjs | null): boolean =>
  !!date?.isBefore(date?.set('hour', OPENING_TIME));
const isAfterBusinessHours = (date: Dayjs | null): boolean =>
  !!date?.isAfter(date?.set('hour', CLOSING_TIME));
const isOutOfBusinessHours = (date: Dayjs | null): boolean =>
  isBeforeBusinessHours(date) || isAfterBusinessHours(date);

const substractWorkdays = (date: Dayjs, numberOfDays: number): Dayjs => {
  let result = date;
  for (let i = numberOfDays; i > 0; i--) {
    result = previousWorkday(result);
  }
  return result;
};

export const addWorkdays = (date: Dayjs, numberOfDays: number): Dayjs => {
  let result = date;
  for (let i = numberOfDays; i > 0; i--) {
    result = nextWorkday(result);
  }
  return result;
};

export const workdayRange = (date: Dayjs, numberOfDays: number): TimeSlot => {
  const daysBehind: number = Math.floor(numberOfDays / 2);
  const daysAhead: number = numberOfDays - daysBehind - 1; // NOTE (pdiego): -1 refers to TODAY.
  return {
    start: startOfWorkday(substractWorkdays(date, daysBehind)),
    end: endOfWorkday(addWorkdays(date, daysAhead)),
  };
};

export const getAppointmentDateError = (dayjs: Dayjs | null): string =>
  isAWeekend(dayjs) ? "It's a weekend" : '';

export const getAppointmentTimeError = (dayjs: Dayjs | null): string => {
  if (isOutOfBusinessHours(dayjs)) {
    return 'Time is out of business hours';
  }
  if (!!((dayjs?.minute() || 0) % MIN_GAP_IN_MINUTES)) {
    return 'Only 0, 15, 30 or 45min allowed';
  }
  return '';
};

/**
 * This function is used to limit the time selection to only allow 15 min fractions of each hour.
 * @param timeValue: time value of clockType
 * @param clockType: time measure. E.g.: seconds, minutes, hours...
 * @returns true when timeValue is 0, 15, 30 or 45 and clocktype is minutes. Otherwise, returns false.
 */
export const onlyAllowQuarters = (
  timeValue: number,
  clockType: string
): boolean => clockType === 'minutes' && !!(timeValue % MIN_GAP_IN_MINUTES);

/**
 * @param date (optional) Dayjs date. Defaults to now.
 * @returns smallest selectable time (inside business hours) from date.
 * If date is inside business hours, returns the date itself.
 */
export const getMinDate = (date = dayjs()): Dayjs => {
  if (isBeforeBusinessHours(date)) {
    return startOfWorkday(date);
  }
  if (isAfterBusinessHours(date)) {
    return startOfWorkday(nextWorkday(date));
  }
  return date;
};

/**
 * @param minutes number of minutes
 * @returns readable string time in hours and minutes.
 * E.g: 15 will return `15min`, 80 will return `1h 20min`.
 */
export const stringifyMinutes = (minutes: number): string => {
  const h: number = Math.floor(minutes / 60);
  const min: number = minutes % 60;
  const readableMin = `${min}min`;
  if (h) {
    return `${h}h ${min < 10 ? '0' : ''}${readableMin}`;
  }
  return readableMin;
};

/**
 * @param date (optional) DayJs date. Defaults to now.
 * @returns closest possible timeslot by 15 min fraction.
 * E.g.: 8:07:20 am will return 8:15:00am
 */
export const getClosestTimeSlot = (date = dayjs()): Dayjs => {
  const currentMinutes = date.minute();
  const minutes =
    (Math.floor(currentMinutes / MIN_GAP_IN_MINUTES) + 1) * MIN_GAP_IN_MINUTES;
  let result = date;
  if (!minutes) {
    result.add(1, 'hour');
  }
  result = result.set('minute', minutes).set('second', 0).set('millisecond', 0);
  return result;
};
