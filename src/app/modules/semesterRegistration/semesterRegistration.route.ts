import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(
    SemesterRegistrationValidation.createSemesterRegistrationZodSchema
  ),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.createSemesterRegistrationController
);

router.get(
  '/get-my-semester-courses',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.getStudentSemesterRegCoursesController
);

router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.getSemesterRegistrationsController
);
// get student registration
router.get(
  '/get-student-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.getStudentRegistrationController
);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.getSingleSemesterRegistrationController
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.deleteSemesterRegistrationController
);
router.patch(
  '/:id',
  validateRequest(
    SemesterRegistrationValidation.updateSemesterRegistrationZodSchema
  ),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.updateSemesterRegistrationController
);

// student registration

router.post(
  '/student-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.createStudentRegistrationController
);
router.post(
  '/enroll-into-course',
  validateRequest(
    SemesterRegistrationValidation.enrollOrWithdrawCourseZodSchema
  ),
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.enrollIntoCourseController
);
router.post(
  '/withdraw-from-course',
  validateRequest(
    SemesterRegistrationValidation.enrollOrWithdrawCourseZodSchema
  ),
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.withdrawFromCourseController
);
router.post(
  '/confirm-student-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.confirmStudentRegistrationController
);

router.post(
  '/:semesterRegistrationId/start-new-semester',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.startNewSemesterController
);

export const SemesterRegistrationRoutes = router;
