// NOTE (pdiego): For simplicity we're assuming that working hours are Mon-Fri: 8AM to 5pm.
export const OPENING_TIME = 8;
export const CLOSING_TIME = 17;
export const MIN_GAP_IN_MINUTES = 15;

export const DATE_FORMAT = 'DD/MM/YYYY';
export const TIME_FORMAT = 'HH:mm';

export enum WEEKDAY {
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY,
}
