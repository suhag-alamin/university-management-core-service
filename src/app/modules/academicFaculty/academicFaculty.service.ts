import { AcademicFaculty, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import {
  academicFacultySearchableFields,
  academicFacultyTitleMapper,
} from './academicFaculty.constant';
import { IAcademicFacultyFilters } from './academicFaculty.interface';

const createAcademicFaculty = async (
  data: AcademicFaculty
): Promise<AcademicFaculty> => {
  if (academicFacultyTitleMapper.includes(data.title)) {
    const result = await prisma.academicFaculty.create({
      data,
    });
    return result;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Faculty!');
  }
};

const getAcademicFaculty = async (
  filters: IAcademicFacultyFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<AcademicFaculty[]>> => {
  const andCondition = [];
  const { searchTerm, ...filtersData } = filters;

  if (searchTerm) {
    andCondition.push({
      OR: academicFacultySearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  if (Object.keys(filtersData).length) {
    andCondition.push({
      AND: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const whereConditions: Prisma.AcademicFacultyWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.academicFaculty.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.academicFaculty.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleFaculty = async (
  id: string
): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateAcademicFaculty = async (
  id: string,
  payload: AcademicFaculty
): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteAcademicFaculty = async (id: string) => {
  const result = await prisma.academicFaculty.delete({
    where: { id },
  });

  return result;
};

export const AcademicFacultyService = {
  createAcademicFaculty,
  getAcademicFaculty,
  getSingleFaculty,
  updateAcademicFaculty,
  deleteAcademicFaculty,
};
