import InitFacultyEvents from '../modules/faculty/faculty.event';
import InitStudentEvents from '../modules/student/student.event';

const subscribeToEvents = () => {
  InitStudentEvents();
  InitFacultyEvents();
};

export default subscribeToEvents;
