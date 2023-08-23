import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { BuildingService } from './building.service';
import sendResponse from '../../../shared/sendResponse';
import { Building } from '@prisma/client';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { buildingFilterableFields } from './building.constant';
import { paginationFields } from '../../../constants/pagination';

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

const getBuildingsController = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, buildingFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await BuildingService.getAllBuildings(
      filters,
      paginationOptions
    );

    sendResponse<Building[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Buildings fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);
const getSingleBuildingController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await BuildingService.getSingleBuilding(id);

    sendResponse<Building>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Building fetched successfully',
      data: result,
    });
  }
);

const updateBuildingController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = req.body;

    const result = await BuildingService.updateBuilding(id, data);

    sendResponse<Building>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Building updated successfully',
      data: result,
    });
  }
);
const deleteBuildingController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await BuildingService.deleteBuilding(id);

    sendResponse<Building>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Building deleted successfully',
      data: result,
    });
  }
);

export const BuildingController = {
  createBuildingController,
  getBuildingsController,
  getSingleBuildingController,
  updateBuildingController,
  deleteBuildingController,
};
