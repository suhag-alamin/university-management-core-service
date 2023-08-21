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

router.patch(
  '/:id',
  validateRequest(FacultyValidation.updateFacultyZodSchema),
  FacultyController.updateFacultyController
);

router.delete('/:id', FacultyController.deleteFacultyController);

export const FacultyRoutes = router;
