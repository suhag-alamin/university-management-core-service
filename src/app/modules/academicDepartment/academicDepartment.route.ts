import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentValidation } from './academicDepartment.validation';
import { AcademicDepartmentController } from './academicDepartment.controller';

const router = express.Router();

router.post(
  '/',
  validateRequest(
    AcademicDepartmentValidation.createAcademicDepartmentZodSchema
  ),
  AcademicDepartmentController.createDepartmentController
);

router.get('/', AcademicDepartmentController.getAllDepartmentsController);
router.get('/:id', AcademicDepartmentController.getSingleDepartmentController);

// router.patch(
//   '/update/:id',
//   validateRequest(
//     AcademicDepartmentValidation.updateAcademicDepartmentZodSchema
//   ),
//   AcademicDepartmentController.updateDepartmentController
// );

// router.delete(
//   '/delete/:id',
//   AcademicDepartmentController.deleteDepartmentController
// );

export const AcademicDepartmentRoutes = router;
