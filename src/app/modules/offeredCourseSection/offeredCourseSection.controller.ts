import { OfferedCourseSection } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OfferedCourseSectionService } from './offeredCourseSection.service';

const createOfferedCourseSectionController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OfferedCourseSectionService.createOfferedSectionCourse(
      req.body
    );

    sendResponse<OfferedCourseSection>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered course section created successfully',
      data: result,
    });
  }
);

export const OfferedCourseSectionController = {
  createOfferedCourseSectionController,
};
