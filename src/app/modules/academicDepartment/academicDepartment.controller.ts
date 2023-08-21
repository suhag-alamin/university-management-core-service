import { Request, Response } from 'express';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';

import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { academicDepartmentFilterableFields } from './academicDepartment.constants';
import { AcademicDepartmentService } from './academicDepartment.service';
import { paginationFields } from '../../../constants/pagination';
import { AcademicDepartment } from '@prisma/client';

const createDepartmentController = catchAsync(
  async (req: Request, res: Response) => {
    const { ...academicDepartmentData } = req.body;
    const result = await AcademicDepartmentService.createAcademicDepartment(
      academicDepartmentData
    );

    sendResponse<AcademicDepartment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Department created successfully',
      data: result,
    });
  }
);

const getAllDepartmentsController = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, academicDepartmentFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await AcademicDepartmentService.getAllAcademicDepartments(
      filters,
      paginationOptions
    );

    sendResponse<AcademicDepartment[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic departments fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getSingleDepartmentController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AcademicDepartmentService.getSingleAcademicDepartment(
      id
    );

    sendResponse<AcademicDepartment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Department fetched successfully',
      data: result,
    });
  }
);

// const updateDepartmentController = catchAsync(
//   async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const result = await AcademicDepartmentService.updateDepartment(
//       id,
//       req.body
//     );

//     sendResponse<AcademicDepartment>(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Academic Department updated successfully',
//       data: result,
//     });
//   }
// );

// const deleteDepartmentController = catchAsync(
//   async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const result = await AcademicDepartmentService.deleteDepartment(id);

//     sendResponse<AcademicDepartment>(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Academic Department deleted successfully',
//       data: result,
//     });
//   }
// );

export const AcademicDepartmentController = {
  createDepartmentController,
  getAllDepartmentsController,
  getSingleDepartmentController,
  // updateDepartmentController,
  // deleteDepartmentController,
};
