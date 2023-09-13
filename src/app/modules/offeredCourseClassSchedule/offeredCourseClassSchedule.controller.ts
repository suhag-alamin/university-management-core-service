import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { OfferedCourseClassScheduleService } from './offeredCourseClassSchedule.service';
import sendResponse from '../../../shared/sendResponse';
import { OfferedCourseClassSchedule } from '@prisma/client';
import httpStatus from 'http-status';

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

export const OfferedCourseClassScheduleController = {
  createOfferedClassScheduleController,
};
