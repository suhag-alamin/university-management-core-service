import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';

const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(StudentValidation.createStudentZodSchema),
  StudentController.createStudentController
);

router.get(
  '/my-courses',
  auth(ENUM_USER_ROLE.STUDENT),
  StudentController.studentCoursesController
);

router.get(
  '/my-course-schedules',
  auth(ENUM_USER_ROLE.STUDENT),
  StudentController.getStudentCourseSchedulesController
);
router.get(
  '/my-academic-info',
  auth(ENUM_USER_ROLE.STUDENT),
  StudentController.studentAcademicInfoController
);

router.get(
  '/:id',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.STUDENT
  ),
  StudentController.getSingleStudentController
);
router.get(
  '/',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.STUDENT
  ),
  StudentController.getAllStudentsController
);

router.patch(
  '/:id',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.STUDENT
  ),
  validateRequest(StudentValidation.updateStudentZodSchema),
  StudentController.updateStudentController
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  StudentController.deleteStudentController
);

export const StudentRoutes = router;
