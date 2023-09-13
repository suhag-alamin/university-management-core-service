import { OfferedCourseClassSchedule, Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { OfferedCourseClassScheduleUtils } from './offeredCourseClassSchedule.utils';
import { IOfferedCourseClassScheduleFilters } from './offeredCourseClassSchedule.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import {
  offeredCourseClassScheduleRelationalFields,
  offeredCourseClassScheduleRelationalFieldsMapper,
  offeredCourseClassScheduleSearchableFields,
} from './offeredCourseClassSchedule.constant';
import { paginationHelpers } from '../../../helpers/paginationHelper';

const createOfferedCourseClassSchedule = async (
  data: OfferedCourseClassSchedule
): Promise<OfferedCourseClassSchedule> => {
  await OfferedCourseClassScheduleUtils.checkRoomAvailability(data);

  const result = await prisma.offeredCourseClassSchedule.create({
    data,
  });
  return result;
};

const getAllOfferedCourseClassSchedules = async (
  filters: IOfferedCourseClassScheduleFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<OfferedCourseClassSchedule[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];
  console.log(searchTerm);

  if (searchTerm) {
    andCondition.push({
      OR: offeredCourseClassScheduleSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andCondition.push({
      AND: Object.keys(filtersData).map(key => {
        if (offeredCourseClassScheduleRelationalFields.includes(key)) {
          return {
            [offeredCourseClassScheduleRelationalFieldsMapper[key]]: {
              id: (filtersData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filtersData as any)[key],
            },
          };
        }
      }),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const whereConditions: Prisma.OfferedCourseClassScheduleWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.offeredCourseClassSchedule.findMany({
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
  const total = await prisma.offeredCourseClassSchedule.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const OfferedCourseClassScheduleService = {
  createOfferedCourseClassSchedule,
  getAllOfferedCourseClassSchedules,
};
