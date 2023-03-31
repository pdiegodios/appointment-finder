import styled from '@emotion/styled';
import {
  FormHelperText,
  List,
  ListItem,
  Paper,
  Typography,
} from '@mui/material';
import SectionTitle from 'components/SectionTitle';
import SpaceBetweenContainer from 'components/SpaceBetweenContainer';
import { DATE_FORMAT } from 'constants/dateTime';
import dayjs from 'dayjs';
import {
  stringifyTimeSlotDay,
  stringifyTimeSlotTime,
} from 'helpers/timeSlotHelper';
import useGetAvailableTimeSlots from 'hooks/useGetAvailableTimeSlots';
import { useAppointmentStore } from 'store';
import { TimeSlot } from 'types';

type TimeSlotsByDay = {
  [key: string]: TimeSlot[];
};

type DailySuggestionsProps = {
  day: string;
  suggestions: TimeSlot[];
};

const StyledList = styled(List)`
  max-height: 10rem;
`;

const StyledListItem = styled(ListItem)`
  padding: 0 0.5rem;
  flex-grow: 1;
  justify-content: center;
`;

const DailySuggestionContainer = styled.div`
  flex-grow: 1;
`;

const StyledHeader = styled(Paper)`
  padding: 0.325rem 0.5rem;
`;

const DailySuggestions: React.FC<DailySuggestionsProps> = ({
  day,
  suggestions,
}) => {
  const now = dayjs();
  const isBeforeToday = now.diff(dayjs(day, DATE_FORMAT), 'day') > 0;
  const toListItem = (timeslot: TimeSlot) => {
    const isBeforeNow = timeslot.end.isBefore(now);
    return (
      <StyledListItem key={timeslot.start.toISOString()}>
        <Typography
          align="center"
          sx={{
            color: theme =>
              isBeforeNow
                ? theme.palette.text.disabled
                : theme.palette.text.primary,
          }}
          variant="caption"
        >
          {stringifyTimeSlotTime(timeslot)}
        </Typography>
      </StyledListItem>
    );
  };
  return (
    <DailySuggestionContainer>
      <StyledHeader variant="outlined">
        <Typography
          sx={{
            color: theme =>
              isBeforeToday
                ? theme.palette.text.disabled
                : theme.palette.text.primary,
            fontWeight: 'bold',
          }}
          align="center"
        >
          {day}
        </Typography>
      </StyledHeader>
      <StyledList>{suggestions.map(toListItem)}</StyledList>
    </DailySuggestionContainer>
  );
};

const AvailabilityContent = () => {
  const { duration, date } = useAppointmentStore();
  const slotSuggestions = useGetAvailableTimeSlots();
  // if ( duration ) {
  //   return (
  //     <FormHelperText>
  //       Specify appointment duration to get availability
  //     </FormHelperText>
  //   );
  // } else
  if (!slotSuggestions.length) {
    return (
      <FormHelperText error>
        No availability close to the requested day
      </FormHelperText>
    );
  }
  const suggestionsByDay: TimeSlotsByDay = slotSuggestions.reduce(
    (result: TimeSlotsByDay, currentSlot: TimeSlot) => {
      const key = stringifyTimeSlotDay(currentSlot);
      return {
        ...result,
        [key]: [...(result[key] || []), currentSlot],
      };
    },
    {}
  );
  return (
    <SpaceBetweenContainer>
      {Object.entries(suggestionsByDay).map(([day, suggestions]) => (
        <DailySuggestions {...{ day, suggestions }} key={day} />
      ))}
    </SpaceBetweenContainer>
  );
};

const AppointmentAvailability = () => (
  <>
    <SectionTitle>Availability</SectionTitle>
    <AvailabilityContent />
  </>
);

export default AppointmentAvailability;
