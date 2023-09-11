import { OfferedCourseSection } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OfferedCourseSectionService } from './offeredCourseSection.service';
import pick from '../../../shared/pick';
import { offeredCourseSectionFilterableFields } from './offeredCourseSection.constant';
import { paginationFields } from '../../../constants/pagination';

const createOfferedCourseSectionController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OfferedCourseSectionService.createOfferedSectionCourse(
      req.body
    );

    sendResponse<OfferedCourseSection>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered course section created successfully',
      data: result,
    });
  }
);

const getAllOfferedCourseSectionController = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, offeredCourseSectionFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await OfferedCourseSectionService.getAllOfferedCourseSection(
      filters,
      paginationOptions
    );

    sendResponse<OfferedCourseSection[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course Sections retrieved successfully!',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getSingleOfferedCourseSectionController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result =
      await OfferedCourseSectionService.getSingleOfferedCourseSection(id);

    sendResponse<OfferedCourseSection>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course Section retrieved successfully!',
      data: result,
    });
  }
);

const updateOfferedCourseSectionController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedData = req.body;

    const result = await OfferedCourseSectionService.updateOfferedCourseSection(
      id,
      updatedData
    );

    sendResponse<OfferedCourseSection>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course Section updated successfully!',
      data: result,
    });
  }
);

const deleteOfferedCourseSectionController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await OfferedCourseSectionService.deleteOfferedCourseSection(
      id
    );

    sendResponse<OfferedCourseSection>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course Section deleted successfully!',
      data: result,
    });
  }
);

export const OfferedCourseSectionController = {
  createOfferedCourseSectionController,
  getAllOfferedCourseSectionController,
  getSingleOfferedCourseSectionController,
  updateOfferedCourseSectionController,
  deleteOfferedCourseSectionController,
};
