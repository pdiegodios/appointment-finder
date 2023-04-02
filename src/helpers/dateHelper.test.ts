import { CLOSING_TIME, OPENING_TIME } from 'constants/dateTime';
import dayjs from 'dayjs';
import {
  endOfWorkday,
  getClosestTimeSlot,
  isAWeekend,
  isOutOfBusinessHours,
  nextWorkday,
  previousWorkday,
  startOfWorkday,
  workdayRange,
} from 'helpers/dateHelper';

describe('dateHelper', () => {
  const sundayDayjs = dayjs().set('year', 2023).set('month', 3).set('date', 2);
  const mondayDayjs = sundayDayjs.add(1, 'day');
  const tuesdayDayjs = mondayDayjs.add(1, 'day');
  const wednesdayDayjs = tuesdayDayjs.add(1, 'day');
  const thursdayDayjs = wednesdayDayjs.add(1, 'day');
  const fridayDayjs = thursdayDayjs.add(1, 'day');
  const saturdayDayjs = fridayDayjs.add(1, 'day');
  describe('previousWorkday', () => {
    it('when Monday, returns Friday', () => {
      expect(previousWorkday(mondayDayjs).day()).toBe(5);
    });
    it('when Tuesday, returns Monday', () => {
      expect(previousWorkday(tuesdayDayjs).day()).toBe(1);
    });
    it('when Wednesday, returns Tuesday', () => {
      expect(previousWorkday(wednesdayDayjs).day()).toBe(2);
    });
    it('when Thursday, returns Wednesday', () => {
      expect(previousWorkday(thursdayDayjs).day()).toBe(3);
    });
    it('when Friday, returns Thursday', () => {
      expect(previousWorkday(fridayDayjs).day()).toBe(4);
    });
    it('when Saturday, returns Friday', () => {
      expect(previousWorkday(saturdayDayjs).day()).toBe(5);
    });
    it('when Sunday, returns Friday', () => {
      expect(previousWorkday(sundayDayjs).day()).toBe(5);
    });
  });
  describe('nexWorkDay', () => {
    it('when Monday, returns Tuesday', () => {
      expect(nextWorkday(mondayDayjs).day()).toBe(2);
    });
    it('when Tuesday, returns Wednesday', () => {
      expect(nextWorkday(tuesdayDayjs).day()).toBe(3);
    });
    it('when Wednesday, returns Thursday', () => {
      expect(nextWorkday(wednesdayDayjs).day()).toBe(4);
    });
    it('when Thursday, returns Friday', () => {
      expect(nextWorkday(thursdayDayjs).day()).toBe(5);
    });
    it('when Friday, returns Monday', () => {
      expect(nextWorkday(fridayDayjs).day()).toBe(1);
    });
    it('when Saturday, returns Monday', () => {
      expect(nextWorkday(saturdayDayjs).day()).toBe(1);
    });
    it('when Sunday, returns Monday', () => {
      expect(nextWorkday(sundayDayjs).day()).toBe(1);
    });
  });
  describe('isAWeekend', () => {
    it('when Monday, returns false', () => {
      expect(isAWeekend(mondayDayjs)).toBe(false);
    });
    it('when Tuesday, returns false', () => {
      expect(isAWeekend(tuesdayDayjs)).toBe(false);
    });
    it('when Wednesday, returns false', () => {
      expect(isAWeekend(wednesdayDayjs)).toBe(false);
    });
    it('when Thursday, returns false', () => {
      expect(isAWeekend(thursdayDayjs)).toBe(false);
    });
    it('when Friday, returns false', () => {
      expect(isAWeekend(fridayDayjs)).toBe(false);
    });
    it('when Saturday, returns true', () => {
      expect(isAWeekend(saturdayDayjs)).toBe(true);
    });
    it('when Sunday, returns true', () => {
      expect(isAWeekend(sundayDayjs)).toBe(true);
    });
  });
  describe('startOfWorkday', () => {
    const expectedTime = mondayDayjs
      .set('hour', OPENING_TIME)
      .set('minute', 0)
      .set('second', 0)
      .set('millisecond', 0);
    it('7:50 am, returns 8:00am', () => {
      const givenTime = mondayDayjs.set('hour', 7).set('minute', 50);
      expect(startOfWorkday(givenTime).isSame(expectedTime)).toBe(true);
    });
    it('0:00 am, returns 8:00am', () => {
      const givenTime = mondayDayjs
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0);
      expect(startOfWorkday(givenTime).isSame(expectedTime)).toBe(true);
    });
    it('9:15 pm, returns 8:00am', () => {
      const givenTime = mondayDayjs.set('hour', 21).set('minute', 15);
      expect(startOfWorkday(givenTime).isSame(expectedTime)).toBe(true);
    });
  });
  describe('endOfWorkday', () => {
    const expectedTime = mondayDayjs
      .set('hour', CLOSING_TIME)
      .set('minute', 0)
      .set('second', 0)
      .set('millisecond', 0);
    it('7:50 am, returns 17:00pm', () => {
      const givenTime = mondayDayjs.set('hour', 7).set('minute', 50);
      expect(endOfWorkday(givenTime).isSame(expectedTime)).toBe(true);
    });
    it('0:00 am, returns 17:00pm', () => {
      const givenTime = mondayDayjs
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0);
      expect(endOfWorkday(givenTime).isSame(expectedTime)).toBe(true);
    });
    it('9:15 pm, returns 17:00pm', () => {
      const givenTime = mondayDayjs.set('hour', 21).set('minute', 15);
      expect(endOfWorkday(givenTime).isSame(expectedTime)).toBe(true);
    });
  });
  describe('isOutOfBusinessHours', () => {
    it('7:50 am, returns true', () => {
      const givenTime = mondayDayjs.set('hour', 7).set('minute', 50);
      expect(isOutOfBusinessHours(givenTime)).toBe(true);
    });
    it('0:00 am, returns true', () => {
      const givenTime = mondayDayjs
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0);
      expect(isOutOfBusinessHours(givenTime)).toBe(true);
    });
    it('8:00 am, returns false', () => {
      const givenTime = mondayDayjs
        .set('hour', 8)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0);
      expect(isOutOfBusinessHours(givenTime)).toBe(false);
    });
    it('12:30 pm, returns false', () => {
      const givenTime = mondayDayjs.set('hour', 12).set('minute', 30);
      expect(isOutOfBusinessHours(givenTime)).toBe(false);
    });
    it('17:00 pm, returns false', () => {
      const givenTime = mondayDayjs
        .set('hour', 17)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0);
      expect(isOutOfBusinessHours(givenTime)).toBe(false);
    });
    it('9:15 pm, returns true', () => {
      const givenTime = mondayDayjs.set('hour', 21).set('minute', 15);
      expect(isOutOfBusinessHours(givenTime)).toBe(true);
    });
  });
  describe('workdayRange', () => {
    it('given monday and 5 days, returns previous thursday and friday, same monday and next tuesday, wednesday', () => {
      const expectedRange = {
        start: startOfWorkday(mondayDayjs.subtract(4, 'day')),
        end: endOfWorkday(mondayDayjs.add(2, 'day')),
      };
      expect(
        workdayRange(mondayDayjs, 5).start.isSame(expectedRange.start)
      ).toBe(true);
      expect(workdayRange(mondayDayjs, 5).end.isSame(expectedRange.end)).toBe(
        true
      );
    });
    it('given wednesday and 3 days, returns previous tuesday to next thursday', () => {
      const expectedRange = {
        start: startOfWorkday(tuesdayDayjs),
        end: endOfWorkday(thursdayDayjs),
      };
      expect(
        workdayRange(wednesdayDayjs, 3).start.isSame(expectedRange.start)
      ).toBe(true);
      expect(
        workdayRange(wednesdayDayjs, 3).end.isSame(expectedRange.end)
      ).toBe(true);
    });
    it('given wednesday and 2 days, returns previous tuesday to wednesday at EOB', () => {
      const expectedRange = {
        start: startOfWorkday(tuesdayDayjs),
        end: endOfWorkday(wednesdayDayjs),
      };
      expect(
        workdayRange(wednesdayDayjs, 2).start.isSame(expectedRange.start)
      ).toBe(true);
      expect(
        workdayRange(wednesdayDayjs, 2).end.isSame(expectedRange.end)
      ).toBe(true);
    });
  });
  describe('getClosestTimeSlot', () => {
    it('8:07:20 am, should return 8:15:00am', () => {
      const givenTime = mondayDayjs
        .set('hour', 8)
        .set('minute', 7)
        .set('second', 20);
      const expectedTime = mondayDayjs
        .set('hour', 8)
        .set('minute', 15)
        .set('second', 0)
        .set('millisecond', 0);
      expect(getClosestTimeSlot(givenTime).isSame(expectedTime)).toBe(true);
    });
    it('8:14:59 am, should return 8:15:00am', () => {
      const givenTime = mondayDayjs
        .set('hour', 8)
        .set('minute', 14)
        .set('second', 59);
      const expectedTime = mondayDayjs
        .set('hour', 8)
        .set('minute', 15)
        .set('second', 0)
        .set('millisecond', 0);
      expect(getClosestTimeSlot(givenTime).isSame(expectedTime)).toBe(true);
    });
    it('8:15:00 am, should return 8:30:00am', () => {
      const givenTime = mondayDayjs
        .set('hour', 8)
        .set('minute', 15)
        .set('second', 0);
      const expectedTime = mondayDayjs
        .set('hour', 8)
        .set('minute', 30)
        .set('second', 0)
        .set('millisecond', 0);
      expect(getClosestTimeSlot(givenTime).isSame(expectedTime)).toBe(true);
    });
    it('23:50:30 am, should return 0:00:00am', () => {
      const givenTime = mondayDayjs
        .set('hour', 23)
        .set('minute', 50)
        .set('second', 30);
      const expectedTime = tuesdayDayjs
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0);
      expect(getClosestTimeSlot(givenTime).isSame(expectedTime)).toBe(true);
    });
  });
});
