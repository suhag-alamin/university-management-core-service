import { RedisClient } from '../../../shared/redis';
import { eventStudentCreated } from './student.constant';
import { StudentService } from './student.service';

const InitStudentEvents = () => {
  RedisClient.subscribe(eventStudentCreated, async (e: string) => {
    const data: any = JSON.parse(e);

    await StudentService.createStudentFromEvent(data);
  });
};

export default InitStudentEvents;
