import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OfferedCourse } from '@prisma/client';
import httpStatus from 'http-status';
import { OfferedCourseService } from './offeredCourse.service';

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

export const OfferedCourseController = {
  createOfferedCourseController,
};
