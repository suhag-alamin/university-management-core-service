import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OfferedCourse } from '@prisma/client';
import httpStatus from 'http-status';
import { OfferedCourseService } from './offeredCourse.service';
import { offeredCourseFilterableFields } from './offeredCourse.constant';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';

const createOfferedCourseController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OfferedCourseService.createOfferedCourse(req.body);

    sendResponse<OfferedCourse[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered courses created successfully',
      data: result,
    });
  }
);

const getAllOfferedCourseController = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, offeredCourseFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await OfferedCourseService.getAllOfferedCourse(
      filters,
      paginationOptions
    );

    sendResponse<OfferedCourse[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Courses retrieved successfully!',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getSingleOfferedCourseController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await OfferedCourseService.getSingleOfferedCourse(id);

    sendResponse<OfferedCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course retrieved successfully!',
      data: result,
    });
  }
);

const updateOfferedCourseController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedData = req.body;

    const result = await OfferedCourseService.updateOfferedCourse(
      id,
      updatedData
    );

    sendResponse<OfferedCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course updated successfully!',
      data: result,
    });
  }
);

const deleteOfferedCourseController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await OfferedCourseService.deleteOfferedCourse(id);

    sendResponse<OfferedCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course deleted successfully!',
      data: result,
    });
  }
);

export const OfferedCourseController = {
  createOfferedCourseController,
  getAllOfferedCourseController,
  getSingleOfferedCourseController,
  updateOfferedCourseController,
  deleteOfferedCourseController,
};
