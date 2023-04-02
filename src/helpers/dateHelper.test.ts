import dayjs from 'dayjs';
import { getClosestTimeSlot, nextWorkday, previousWorkday } from 'helpers/dateHelper';

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
  describe('getClosestTimeSlot', () => {
    it('8:07:20 am, should return 8:15:00am', () => {
      const givenTime = mondayDayjs.set('hour', 8).set('minute', 7).set('second', 20);
      const expectedTime = mondayDayjs.set('hour', 8).set('minute', 15).set('second', 0).set('millisecond', 0);
      expect(getClosestTimeSlot(givenTime).isSame(expectedTime)).toBe(true);
    });
    it('8:14:59 am, should return 8:15:00am', () => {
      const givenTime = mondayDayjs.set('hour', 8).set('minute', 14).set('second', 59);
      const expectedTime = mondayDayjs.set('hour', 8).set('minute', 15).set('second', 0).set('millisecond', 0);
      expect(getClosestTimeSlot(givenTime).isSame(expectedTime)).toBe(true);
    });
    it('8:15:00 am, should return 8:30:00am', () => {
      const givenTime = mondayDayjs.set('hour', 8).set('minute', 15).set('second', 0);
      const expectedTime = mondayDayjs.set('hour', 8).set('minute', 30).set('second', 0).set('millisecond', 0);
      expect(getClosestTimeSlot(givenTime).isSame(expectedTime)).toBe(true);
    });
    it('23:50:30 am, should return 0:00:00am', () => {
      const givenTime = mondayDayjs.set('hour', 23).set('minute', 50).set('second', 30);
      const expectedTime = tuesdayDayjs.set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0);
      expect(getClosestTimeSlot(givenTime).isSame(expectedTime)).toBe(true);
    });

  })
});
