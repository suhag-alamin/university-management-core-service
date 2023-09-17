import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { StudentEnrolledCourseMarkService } from './studentEnrolledCourseMark.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { studentEnrolledCourseMarkFilterableFields } from './studentEnrolledCourseMark.constant';

const getAllStudentMarksController = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, studentEnrolledCourseMarkFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await StudentEnrolledCourseMarkService.getAllStudentMarks(
      filters,
      options
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student course marks fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

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

const updateFinalMarksController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await StudentEnrolledCourseMarkService.updateFinalMarks(
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Final marks updated!',
      data: result,
    });
  }
);

export const StudentEnrolledCourseMarkController = {
  getAllStudentMarksController,
  updateStudentMarkController,
  updateFinalMarksController,
};
