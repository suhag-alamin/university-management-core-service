import express from 'express';
import { BuildingController } from './building.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { BuildingValidation } from './building.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(BuildingValidation.createBuildingZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BuildingController.createBuildingController
);

export const BuildingRoutes = router;
