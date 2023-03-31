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

export const isAWeekend = (date: Dayjs | null): boolean =>
  !!date && [WEEKDAY.SATURDAY, WEEKDAY.SUNDAY].includes(getWeekday(date));

const isBeforeBusinessHours = (date: Dayjs | null): boolean =>
  !!date?.isBefore(date?.set('hour', OPENING_TIME));
const isAfterBusinessHours = (date: Dayjs | null): boolean =>
  !!date?.isAfter(date?.set('hour', CLOSING_TIME));

const isOutOfBusinessHours = (date: Dayjs | null): boolean =>
  isBeforeBusinessHours(date) || isAfterBusinessHours(date);

export const getAppointmentDateError = (dayjs: Dayjs | null): string => {
  if (isAWeekend(dayjs)) {
    return "It's a weekend";
  }
  if (isOutOfBusinessHours(dayjs)) {
    return 'Time is out of business hours';
  }
  if (!!((dayjs?.minute() || 0) % MIN_GAP_IN_MINUTES)) {
    return 'Only 0, 15, 30 or 45min allowed';
  }
  return '';
};

export const startOfWorkday = (date: Dayjs): Dayjs =>
  date.set('hour', OPENING_TIME).set('minute', 0);
export const endOfWorkday = (date: Dayjs): Dayjs =>
  date.set('hour', CLOSING_TIME).set('minute', 0);

export const getMinDate = (): Dayjs => {
  const now = dayjs();
  if (isBeforeBusinessHours(now)) {
    return startOfWorkday(now);
  }
  if (isOutOfBusinessHours(now)) {
    return startOfWorkday(nextWorkday(now));
  }
  return now;
};

export const stringifyMinutes = (minutes: number): string => {
  const h: number = Math.floor(minutes / 60);
  const min: number = minutes % 60;
  const readableMin = `${min}min`;
  if (h) {
    return `${h}h ${min < 10 ? '0' : ''}${readableMin}`;
  }
  return readableMin;
};
