import express from 'express';
import { AcademicSemesterController } from './academicSemester.controller';
import { AcademicSemesterValidation } from './academicSemester.validation';
import validateRequest from '../../middlewares/validateRequest';
const router = express.Router();

router.post(
  '/',
  validateRequest(AcademicSemesterValidation.createAcademicSemesterZodSchema),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AcademicSemesterController.createAcademicSemesterController
);

router.get('/', AcademicSemesterController.getAllAcademicSemesterController);
router.get(
  '/:id',
  AcademicSemesterController.getSingleAcademicSemesterController
);

// router.patch(
//   '/:id',
//   validateRequest(AcademicSemesterValidation.updateAcademicSemesterZodSchema),
//   AcademicSemesterController.updateAcademicSemesterController
// );

// router.delete(
//   '/:id',
//   AcademicSemesterController.deleteAcademicSemesterController
// );

export const AcademicSemesterRoutes = router;
