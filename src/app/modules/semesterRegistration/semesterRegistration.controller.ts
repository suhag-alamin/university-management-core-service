import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { SemesterRegistrationService } from './semesterRegistration.service';
import sendResponse from '../../../shared/sendResponse';
import { SemesterRegistration } from '@prisma/client';
import httpStatus from 'http-status';

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

export const SemesterRegistrationController = {
  createSemesterRegistrationController,
};
