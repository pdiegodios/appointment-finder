import dayjs from 'dayjs';
import { isAppointmentOverlap } from 'helpers/timeSlotHelper';
import { TestAppointment } from 'types';

describe('code test -- isAppointmentOverlap', () => {
  const now = dayjs();
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
