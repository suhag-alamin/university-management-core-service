import { RedisClient } from '../../../shared/redis';
import {
  eventStudentCreated,
  eventStudentDeleted,
  eventStudentUpdated,
} from './student.constant';
import { StudentService } from './student.service';

const InitStudentEvents = () => {
  RedisClient.subscribe(eventStudentCreated, async (e: string) => {
    const data: any = JSON.parse(e);

    await StudentService.createStudentFromEvent(data);
  });
  RedisClient.subscribe(eventStudentUpdated, async (e: string) => {
    const data: any = JSON.parse(e);

    await StudentService.updateStudentFromEvent(data);
  });
  RedisClient.subscribe(eventStudentDeleted, async (e: string) => {
    const data: any = JSON.parse(e);

    await StudentService.deleteStudentFromEvent(data);
    console.log('deleted', data);
  });
};

export default InitStudentEvents;
