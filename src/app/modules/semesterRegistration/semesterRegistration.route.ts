import express from 'express';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post(
  '/',
  validateRequest(
    SemesterRegistrationValidation.createSemesterRegistrationZodSchema
  ),
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.STUDENT
  ),
  SemesterRegistrationController.createSemesterRegistrationController
);

router.get(
  '/',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.STUDENT
  ),
  SemesterRegistrationController.getSemesterRegistrationsController
);
router.get(
  '/:id',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.STUDENT
  ),
  SemesterRegistrationController.getSingleSemesterRegistrationController
);
router.delete(
  '/:id',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.STUDENT
  ),
  SemesterRegistrationController.deleteSemesterRegistrationController
);
router.patch(
  '/:id',
  validateRequest(
    SemesterRegistrationValidation.updateSemesterRegistrationZodSchema
  ),
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.STUDENT
  ),
  SemesterRegistrationController.updateSemesterRegistrationController
);

export const SemesterRegistrationRoutes = router;
