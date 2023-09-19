import { RedisClient } from '../../../shared/redis';
import { FacultyService } from './faculty.service';
import { eventFacultyCreated } from './facuty.constant';

const InitFacultyEvents = () => {
  RedisClient.subscribe(eventFacultyCreated, async (e: string) => {
    const data: any = JSON.parse(e);

    await FacultyService.createFacultyFromEvent(data);
  });
};

export default InitFacultyEvents;
