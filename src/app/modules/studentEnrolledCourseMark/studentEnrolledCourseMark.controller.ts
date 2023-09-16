import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { StudentEnrolledCourseMarkService } from './studentEnrolledCourseMark.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
const updateStudentMarkController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await StudentEnrolledCourseMarkService.updateStudentMark(
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student mark successfully',
      data: result,
    });
  }
);

export const StudentEnrolledCourseMarkController = {
  updateStudentMarkController,
};
