import express from 'express';
import { FacultyController } from './faculty.controller';
import { FacultyValidation } from './faculty.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(FacultyValidation.createFacultyZodSchema),
  FacultyController.createFacultyController
);

router.get(
  '/my-courses',
  auth(ENUM_USER_ROLE.FACULTY),
  FacultyController.facultyCoursesController
);

router.get(
  '/my-course-students',
  auth(ENUM_USER_ROLE.FACULTY),
  FacultyController.getFacultyCourseStudentsController
);

router.get(
  '/:id',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.FACULTY
  ),
  FacultyController.getSingleFacultyController
);
router.get(
  '/',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.FACULTY
  ),
  FacultyController.getAllFacultiesController
);

router.patch(
  '/:id',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.FACULTY
  ),
  validateRequest(FacultyValidation.updateFacultyZodSchema),
  FacultyController.updateFacultyController
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FacultyController.deleteFacultyController
);

// courses

router.post(
  '/:id/assign-courses',
  validateRequest(FacultyValidation.assignOrRemoveCoursesZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FacultyController.assignCoursesController
);
router.delete(
  '/:id/remove-courses',
  validateRequest(FacultyValidation.assignOrRemoveCoursesZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FacultyController.removeCoursesController
);

export const FacultyRoutes = router;
