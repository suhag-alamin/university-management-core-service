import { Student } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { studentFilterableFields } from './student.constant';
import { StudentService } from './student.service';

const createStudentController = catchAsync(
  async (req: Request, res: Response) => {
    const faculty = req.body;
    const result = await StudentService.createStudent(faculty);

    sendResponse<Student>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student created successfully!',
      data: result,
    });
  }
);

const getAllStudentsController = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, studentFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await StudentService.getAllStudents(
      filters,
      paginationOptions
    );

    sendResponse<Student[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Students retrieved successfully!',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getSingleStudentController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await StudentService.getSingleStudent(id);

    sendResponse<Student>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student retrieved successfully!',
      data: result,
    });
  }
);

const updateStudentController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedData = req.body;
    const result = await StudentService.updateStudent(id, updatedData);

    sendResponse<Student>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student updated successfully!',

      data: result,
    });
  }
);

// const deleteFacultyController = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const result = await FacultyService.deleteFaculty(id);

//   sendResponse<IFaculty>(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'faculty deleted successfully !',
//     data: result,

//   });

// });

export const StudentController = {
  createStudentController,
  getAllStudentsController,
  getSingleStudentController,
  updateStudentController,
  // deleteFaculty,
};
