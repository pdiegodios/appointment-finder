import useGetAvailableTimeSlots from "hooks/useGetAvailableTimeSlots";
import { useAppointmentStore } from "store";
import { TimeSlot } from "types";

const useIsAvailableTimeSlot = (): boolean => {
    const {
      date: start,
      duration,
    } = useAppointmentStore();
    const availableTimeSlots: TimeSlot[] = useGetAvailableTimeSlots();

    if (!start || !duration) return false;
    
    const end = start?.add(duration, 'minute');
    return !!availableTimeSlots.find(t => {
        const matchStart: boolean =
          t.start.isBefore(start) || t.start.isSame(start);
        const matchEnd: boolean = t.end.isAfter(end) || t.end.isSame(end);
        return matchStart && matchEnd;
      });
}

export default useIsAvailableTimeSlot;