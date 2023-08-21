import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyController } from './academicFaculty.controller';
import { AcademicFacultyValidation } from './academicFaculty.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(AcademicFacultyValidation.createAcademicFacultyZodSchema),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AcademicFacultyController.createAcademicFacultyController
);

router.get(
  '/',
  // auth(
  //   ENUM_USER_ROLE.SUPER_ADMIN,
  //   ENUM_USER_ROLE.ADMIN,
  //   ENUM_USER_ROLE.FACULTY,
  //   ENUM_USER_ROLE.STUDENT
  // ),
  AcademicFacultyController.getAcademicFacultyController
);
router.get(
  '/:id',
  // auth(
  //   ENUM_USER_ROLE.SUPER_ADMIN,
  //   ENUM_USER_ROLE.ADMIN,
  //   ENUM_USER_ROLE.FACULTY,
  //   ENUM_USER_ROLE.STUDENT
  // ),
  AcademicFacultyController.getSingleFacultyController
);

// router.patch(
//   '/update/:id',
//   validateRequest(AcademicFacultyValidation.updateAcademicFacultyZodSchema),
//   auth(
//     ENUM_USER_ROLE.SUPER_ADMIN,
//     ENUM_USER_ROLE.ADMIN,
//     ENUM_USER_ROLE.FACULTY
//   ),
//   AcademicFacultyController.updateAcademicFaculty
// );

// router.delete(
//   '/delete/:id',
//   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
//   AcademicFacultyController.deleteAcademicFaculty
// );

export const AcademicFacultyRoutes = router;
