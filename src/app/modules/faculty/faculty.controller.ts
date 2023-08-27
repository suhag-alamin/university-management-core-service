import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { facultyFilterableFields } from './facuty.constant';
import { FacultyService } from './faculty.service';
import { paginationFields } from '../../../constants/pagination';
import { CourseFaculty, Faculty } from '@prisma/client';

const createFacultyController = catchAsync(
  async (req: Request, res: Response) => {
    const faculty = req.body;
    const result = await FacultyService.createFaculty(faculty);

    sendResponse<Faculty>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user created successfully!',
      data: result,
    });
  }
);

const getAllFacultiesController = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, facultyFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await FacultyService.getAllFaculties(
      filters,
      paginationOptions
    );

    sendResponse<Faculty[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'faculties retrieved successfully!',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getSingleFacultyController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await FacultyService.getSingleFaculty(id);

    sendResponse<Faculty>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'faculty retrieved successfully !',
      data: result,
    });
  }
);

const updateFacultyController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedData = req.body;
    const result = await FacultyService.updateFaculty(id, updatedData);

    sendResponse<Faculty>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'faculty updated successfully !',

      data: result,
    });
  }
);

const deleteFacultyController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await FacultyService.deleteFaculty(id);

    sendResponse<Faculty>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'faculty deleted successfully !',
      data: result,
    });
  }
);

const assignCoursesController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await FacultyService.assignCourses(id, req.body.courses);

    sendResponse<CourseFaculty[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Assign Courses to faculties successfully',
      data: result,
    });
  }
);
const removeCoursesController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await FacultyService.removeCourses(id, req.body.courses);

    sendResponse<CourseFaculty[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Deleted Courses from faculties successfully',
      data: result,
    });
  }
);

export const FacultyController = {
  createFacultyController,
  getAllFacultiesController,
  getSingleFacultyController,
  updateFacultyController,
  deleteFacultyController,
  assignCoursesController,
  removeCoursesController,
};
