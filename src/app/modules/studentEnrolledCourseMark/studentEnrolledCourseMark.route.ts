import express from 'express';
import { StudentEnrolledCourseMarkController } from './studentEnrolledCourseMark.controller';
const router = express.Router();

router.patch(
  '/update-marks',
  StudentEnrolledCourseMarkController.updateStudentMarkController
);

export const StudentEnrolledCourseMarksRoutes = router;
