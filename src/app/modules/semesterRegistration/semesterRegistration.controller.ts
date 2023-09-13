import { SemesterRegistration } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { semesterRegistrationFilterableFields } from './semesterRegistration.constant';
import { SemesterRegistrationService } from './semesterRegistration.service';

const createSemesterRegistrationController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SemesterRegistrationService.createSemesterRegistration(
      req.body
    );

    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester registration completed successfully',
      data: result,
    });
  }
);
const getSemesterRegistrationsController = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, semesterRegistrationFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await SemesterRegistrationService.getSemesterRegistrations(
      filters,
      paginationOptions
    );

    sendResponse<SemesterRegistration[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester registrations fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);
const getSingleSemesterRegistrationController = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await SemesterRegistrationService.getSingleSemesterRegistration(
        req.params.id
      );

    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester registration fetched successfully',
      data: result,
    });
  }
);
const deleteSemesterRegistrationController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SemesterRegistrationService.deleteSemesterRegistration(
      req.params.id
    );

    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester registration deleted successfully',
      data: result,
    });
  }
);
const updateSemesterRegistrationController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SemesterRegistrationService.updateSemesterRegistration(
      req.params.id,
      req.body
    );

    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester registration updated successfully',
      data: result,
    });
  }
);

// student

const createStudentRegistrationController = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const result = await SemesterRegistrationService.createStudentRegistration(
      user?.id
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Semester registration started successfully',
      data: result,
    });
  }
);

export const SemesterRegistrationController = {
  createSemesterRegistrationController,
  getSemesterRegistrationsController,
  getSingleSemesterRegistrationController,
  deleteSemesterRegistrationController,
  updateSemesterRegistrationController,
  createStudentRegistrationController,
};
