import express from 'express';
import { StudentEnrolledCourseMarkController } from './studentEnrolledCourseMark.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { StudentEnrolledCourseMarkValidation } from './studentEnrolledCourseMark.validation';
const router = express.Router();

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.FACULTY),
  StudentEnrolledCourseMarkController.getAllStudentMarksController
);

router.get(
  '/my-marks',
  auth(ENUM_USER_ROLE.STUDENT),
  StudentEnrolledCourseMarkController.getStudentCourseMarksController
);

router.patch(
  '/update-marks',
  validateRequest(
    StudentEnrolledCourseMarkValidation.updateStudentMarksZodSchema
  ),
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.FACULTY),
  StudentEnrolledCourseMarkController.updateStudentMarkController
);

router.patch(
  '/update-final-marks',
  validateRequest(
    StudentEnrolledCourseMarkValidation.updateStudentCourseFinalMarksZodSchema
  ),
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.FACULTY),
  StudentEnrolledCourseMarkController.updateFinalMarksController
);

export const StudentEnrolledCourseMarksRoutes = router;
