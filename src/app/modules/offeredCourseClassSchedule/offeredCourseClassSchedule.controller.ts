import { OfferedCourseClassSchedule } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OfferedCourseClassScheduleService } from './offeredCourseClassSchedule.service';
import pick from '../../../shared/pick';
import { offeredCourseClassScheduleFilterableFields } from './offeredCourseClassSchedule.constant';
import { paginationFields } from '../../../constants/pagination';

const createOfferedClassScheduleController = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await OfferedCourseClassScheduleService.createOfferedCourseClassSchedule(
        req.body
      );

    sendResponse<OfferedCourseClassSchedule>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered course class schedule created successfully',
      data: result,
    });
  }
);
const getAllOfferedCourseClassSchedulesController = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, offeredCourseClassScheduleFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result =
      await OfferedCourseClassScheduleService.getAllOfferedCourseClassSchedules(
        filters,
        paginationOptions
      );

    sendResponse<OfferedCourseClassSchedule[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered course class schedule retrieved successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

export const OfferedCourseClassScheduleController = {
  createOfferedClassScheduleController,
  getAllOfferedCourseClassSchedulesController,
};
