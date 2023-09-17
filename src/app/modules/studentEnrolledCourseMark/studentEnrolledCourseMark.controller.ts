import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { studentEnrolledCourseMarkFilterableFields } from './studentEnrolledCourseMark.constant';
import { StudentEnrolledCourseMarkService } from './studentEnrolledCourseMark.service';

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

const getStudentCourseMarksController = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, studentEnrolledCourseMarkFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const user = req.user;

    const result = await StudentEnrolledCourseMarkService.getStudentCourseMarks(
      filters,
      options,
      user
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student course marks retrieved successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

export const StudentEnrolledCourseMarkController = {
  getAllStudentMarksController,
  updateStudentMarkController,
  updateFinalMarksController,
  getStudentCourseMarksController,
};
