import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { CourseController } from './course.controller';
import { CourseValidation } from './course.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(CourseValidation.createCourseZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),

  CourseController.createCourseController
);

router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseController.getCoursesController
);
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseController.getSingleCourseController
);
router.patch(
  '/:id',
  validateRequest(CourseValidation.updateCourseZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseController.updateCourseController
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseController.deleteCourseController
);

// faculties

router.post(
  '/:id/assign-faculties',
  validateRequest(CourseValidation.assignOrRemoveFacultiesZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseController.assignFacultiesController
);
router.delete(
  '/:id/remove-faculties',
  validateRequest(CourseValidation.assignOrRemoveFacultiesZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseController.removeFacultiesController
);

export const CourseRoutes = router;
