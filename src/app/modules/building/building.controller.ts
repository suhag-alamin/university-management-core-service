import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { BuildingService } from './building.service';
import sendResponse from '../../../shared/sendResponse';
import { Building } from '@prisma/client';
import httpStatus from 'http-status';

const createBuildingController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BuildingService.createBuilding(req.body);

    sendResponse<Building>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Building created successfully!',
      data: result,
    });
  }
);

export const BuildingController = {
  createBuildingController,
};
