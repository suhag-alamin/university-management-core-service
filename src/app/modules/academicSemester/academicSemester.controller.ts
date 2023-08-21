import { AcademicSemester } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AcademicSemesterService } from './academicSemester.service';
import pick from '../../../shared/pick';
import { academicSemesterFilterableFields } from './academicSemester.constant';
import { paginationFields } from '../../../constants/pagination';

const createAcademicSemesterController = catchAsync(
  async (req: Request, res: Response) => {
    const { ...academicSemesterData } = req.body;
    const result = await AcademicSemesterService.createAcademicSemester(
      academicSemesterData
    );

    sendResponse<AcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic semester created successfully!',
      data: result,
    });
  }
);

const getAllAcademicSemesterController = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, academicSemesterFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await AcademicSemesterService.getAllAcademicSemesters(
      filters,
      paginationOptions
    );

    sendResponse<AcademicSemester[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semester retrieved successfully!',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getSingleAcademicSemesterController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await AcademicSemesterService.getSingleAcademicSemester(id);

    sendResponse<AcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semester retrieved successfully!',
      data: result,
    });
  }
);

const updateAcademicSemesterController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedData = req.body;

    const result = await AcademicSemesterService.updateAcademicSemester(
      id,
      updatedData
    );

    sendResponse<AcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semester updated successfully!',
      data: result,
    });
  }
);

const deleteAcademicSemesterController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await AcademicSemesterService.deleteAcademicSemester(id);

    sendResponse<AcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semester deleted successfully!',
      data: result,
    });
  }
);

export const AcademicSemesterController = {
  createAcademicSemesterController,
  getAllAcademicSemesterController,
  getSingleAcademicSemesterController,
  updateAcademicSemesterController,
  deleteAcademicSemesterController,
};
