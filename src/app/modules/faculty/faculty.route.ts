import express from 'express';
import { FacultyController } from './faculty.controller';
import { FacultyValidation } from './faculty.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/',
  validateRequest(FacultyValidation.createFacultyZodSchema),
  FacultyController.createFacultyController
);

router.get('/:id', FacultyController.getSingleFacultyController);
router.get('/', FacultyController.getAllFacultiesController);

// router.patch(
//   '/update/:id',
//   validateRequest(FacultyValidation.updateFacultyZodSchema),
//   FacultyController.updateFaculty
// );

// router.delete('/delete/:id', FacultyController.deleteFaculty);

export const FacultyRoutes = router;
