import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { academicFacultyFilterableFields } from './academicFaculty.constant';
import { AcademicFacultyService } from './academicFaculty.service';
import { AcademicFaculty } from '@prisma/client';

const createAcademicFacultyController = catchAsync(
  async (req: Request, res: Response) => {
    const { ...academicFacultyData } = req.body;

    const result = await AcademicFacultyService.createAcademicFaculty(
      academicFacultyData
    );

    sendResponse<AcademicFaculty>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Faculty is created successfully',
      data: result,
    });
  }
);

const getAcademicFacultyController = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, academicFacultyFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await AcademicFacultyService.getAcademicFaculty(
      filters,
      paginationOptions
    );

    sendResponse<AcademicFaculty[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty retrieved successfully!',
      meta: result?.meta,
      data: result?.data,
    });
  }
);

const getSingleFacultyController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await AcademicFacultyService.getSingleFaculty(id);
    console.log(result);
    sendResponse<AcademicFaculty>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty retrieved successfully!',
      data: result,
    });
  }
);

// const updateFacultyController = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const updatedData = req.body;
//   const result = await AcademicFacultyService.updateAcademicFaculty(
//     id,
//     updatedData
//   );

//   sendResponse<IAcademicFaculty>(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Faculty updated successfully!',
//     data: result,
//   });
// });

// const deleteFacultyController = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id;

//   const result = await AcademicFacultyService.deleteAcademicFaculty(id);
//   sendResponse<IAcademicFaculty>(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Faculty deleted successfully!',
//     data: result,
//   });
// });

export const AcademicFacultyController = {
  createAcademicFacultyController,
  getAcademicFacultyController,
  getSingleFacultyController,
  // updateFacultyController,
  // deleteFacultyController,
};
