import DeleteIcon from '@mui/icons-material/Delete';
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  styled,
} from '@mui/material';
import SectionTitle from 'components/SectionTitle';
import dayjs from 'dayjs';
import { stringifyTimeSlot } from 'helpers/timeSlotHelper';
import { useAppointmentStore } from 'store';
import { TimeSlot } from 'types';

const StyledItem = styled(Paper)`
  margin-bottom: 0.5rem;
`;

const AppointmentList = () => {
  const { appointments, deleteAppointment } = useAppointmentStore();
  const toListItem = (timeslot: TimeSlot) => {
    const onDelete = () => deleteAppointment(timeslot);
    return (
      <StyledItem variant="outlined" key={timeslot.start.toISOString()}>
        <ListItem
          secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemText primary={stringifyTimeSlot(timeslot)} />
        </ListItem>
      </StyledItem>
    );
  };
  const now = dayjs();
  return (
    <>
      <SectionTitle>Next appointments</SectionTitle>
      <List>
        {appointments.filter(a => a.start.isAfter(now)).map(toListItem)}
      </List>
    </>
  );
};

export default AppointmentList;
