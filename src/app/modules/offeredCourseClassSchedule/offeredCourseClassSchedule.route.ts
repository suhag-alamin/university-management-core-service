import express from 'express';
import { OfferedCourseClassScheduleController } from './offeredCourseClassSchedule.controller';

const router = express.Router();

router.post(
  '/',
  OfferedCourseClassScheduleController.createOfferedClassScheduleController
);
router.get(
  '/',
  OfferedCourseClassScheduleController.getAllOfferedCourseClassSchedulesController
);

export const OfferedCourseClassScheduleRoutes = router;
