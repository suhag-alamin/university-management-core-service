import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { CourseService } from './course.service';
import sendResponse from '../../../shared/sendResponse';
import { Course } from '@prisma/client';
import httpStatus from 'http-status';
import { CourseFilterableFields } from './course.constant';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';

const createCourseController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CourseService.createCourse(req.body);

    sendResponse<Course>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Course created successfully',
      data: result,
    });
  }
);

const getCoursesController = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, CourseFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CourseService.getAllCourses(filters, paginationOptions);

  sendResponse<Course[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});
const getSingleCourseController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await CourseService.getSingleCourse(id);

    sendResponse<Course>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Course fetched successfully',
      data: result,
    });
  }
);

const updateCourseController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = req.body;

    const result = await CourseService.updateCourse(id, data);

    sendResponse<Course>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Course updated successfully',
      data: result,
    });
  }
);
const deleteCourseController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await CourseService.deleteCourse(id);

    sendResponse<Course>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Course deleted successfully',
      data: result,
    });
  }
);

export const CourseController = {
  createCourseController,
  getCoursesController,
  getSingleCourseController,
  updateCourseController,
  deleteCourseController,
};
