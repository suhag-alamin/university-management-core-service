import { RedisClient } from '../../../shared/redis';
import { FacultyService } from './faculty.service';
import {
  eventFacultyCreated,
  eventFacultyDeleted,
  eventFacultyUpdated,
} from './facuty.constant';

const InitFacultyEvents = () => {
  RedisClient.subscribe(eventFacultyCreated, async (e: string) => {
    const data: any = JSON.parse(e);

    await FacultyService.createFacultyFromEvent(data);
  });
  RedisClient.subscribe(eventFacultyUpdated, async (e: string) => {
    const data: any = JSON.parse(e);

    await FacultyService.updateFacultyFromEvent(data);
  });
  RedisClient.subscribe(eventFacultyDeleted, async (e: string) => {
    const data: any = JSON.parse(e);

    await FacultyService.deleteFacultyFromEvent(data);
  });
};

export default InitFacultyEvents;
