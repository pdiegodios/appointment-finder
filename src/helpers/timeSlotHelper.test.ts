import dayjs from 'dayjs';
import {
  isAppointmentOverlap,
  stringifyTimeSlotDay,
  stringifyTimeSlotTime,
} from 'helpers/timeSlotHelper';

describe('timeSlotHelper', () => {
  const now = dayjs();
  describe('stringifyTimeSlotTime', () => {
    describe('when time slot goes from 1pm to 3:45pm', () => {
      const timeSlot = {
        start: now.set('hour', 13).set('minute', 0),
        end: now.set('hour', 15).set('minute', 45),
      };

      const expected = '13:00 - 15:45';

      it(`should return ${expected}`, () => {
        expect(stringifyTimeSlotTime(timeSlot)).toBe(expected);
      });
    });
  });
  describe('stringifyTimeSlotDay', () => {
    describe('when start day is May 25th of 1986', () => {
      const timeSlot = {
        start: now.set('year', 1986).set('month', 4).set('date', 25),
        end: now,
      };

      const expected = '25/05/1986';

      it(`should return ${expected}`, () => {
        expect(stringifyTimeSlotDay(timeSlot)).toBe(expected);
      });
    });
  });

  describe('code test -- isAppointmentOverlap', () => {
    describe('when 2 appointments start at the same time', () => {
      const start = now;
      describe('when they have same duration', () => {
        const duration = 100;
        const app1 = { start, duration };
        const app2 = { start, duration };
        it('should always return true', () => {
          expect(isAppointmentOverlap(app1, app2)).toBe(true);
        });
      });
      describe('when they have different duration', () => {
        it('and duration is more than 0, should return true', () => {
          const app1 = { start, duration: 1 };
          const app2 = { start, duration: 20 };
          expect(isAppointmentOverlap(app1, app2)).toBe(true);
        });
        it('and duration is 0, should return false', () => {
          const app1 = { start, duration: 16 };
          const app2 = { start, duration: 0 };
          expect(isAppointmentOverlap(app1, app2)).toBe(false);
        });
      });
    });
    describe('when 2 appointments start 50 min away from each other', () => {
      const tomorrow = now.add(1, 'day');
      const tomorrow50MinLater = tomorrow.add(50, 'minute');
      const lastAppointment = {
        start: tomorrow50MinLater,
        duration: 1000,
      };
      it('when the first appointment goes over 50min, should return true', () => {
        const firstAppointment = {
          start: tomorrow,
          duration: 51,
        };
        expect(isAppointmentOverlap(firstAppointment, lastAppointment)).toBe(
          true
        );
      });
      it('when the first appointment does not go over 50min, should return false', () => {
        const firstAppointment = {
          start: tomorrow,
          duration: 49,
        };
        expect(isAppointmentOverlap(firstAppointment, lastAppointment)).toBe(
          false
        );
      });
      it('when the first appointment lasts 50min, should return false', () => {
        const firstAppointment = {
          start: tomorrow,
          duration: 50,
        };
        expect(isAppointmentOverlap(firstAppointment, lastAppointment)).toBe(
          false
        );
      });
      it('when the first appointment lasts 50min and the order of the params is different, should still return false', () => {
        const firstAppointment = {
          start: tomorrow,
          duration: 50,
        };
        expect(isAppointmentOverlap(lastAppointment, firstAppointment)).toBe(
          false
        );
      });
    });
  });
});
