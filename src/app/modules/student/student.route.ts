import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(StudentValidation.createStudentZodSchema),
  StudentController.createStudentController
);

router.get('/:id', StudentController.getSingleStudentController);
router.get('/', StudentController.getAllStudentsController);

router.patch(
  '/:id',
  validateRequest(StudentValidation.updateStudentZodSchema),
  StudentController.updateStudentController
);

router.delete('/:id', StudentController.deleteStudentController);

export const StudentRoutes = router;
