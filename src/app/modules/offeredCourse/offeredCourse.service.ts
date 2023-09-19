import { OfferedCourse, Prisma } from '@prisma/client';
import {
  ICreateOfferedCourse,
  IOfferedCourseFilters,
} from './offeredCourse.interface';
import { asyncForEach } from '../../../shared/utils';
import prisma from '../../../shared/prisma';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import {
  eventOfferedCourseCreated,
  eventOfferedCourseDeleted,
  eventOfferedCourseUpdated,
  offeredCourseRelationalFields,
  offeredCourseRelationalFieldsMapper,
  offeredCourseSearchableFields,
} from './offeredCourse.constant';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { RedisClient } from '../../../shared/redis';

const createOfferedCourse = async (
  data: ICreateOfferedCourse
): Promise<OfferedCourse[]> => {
  const { academicDepartmentId, semesterRegistrationId, courseIds } = data;
  const result: OfferedCourse[] = [];
  await asyncForEach(courseIds, async (courseId: string) => {
    const alreadyExist = await prisma.offeredCourse.findFirst({
      where: {
        academicDepartmentId,
        semesterRegistrationId,
        courseId,
      },
    });
    if (!alreadyExist) {
      const insetOfferedCourse = await prisma.offeredCourse.create({
        data: {
          academicDepartmentId,
          semesterRegistrationId,
          courseId,
        },
      });
      result.push(insetOfferedCourse);
    }
  });

  if (result) {
    await RedisClient.publish(
      eventOfferedCourseCreated,
      JSON.stringify(result)
    );
  }
  return result;
};

const getAllOfferedCourse = async (
  filters: IOfferedCourseFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<OfferedCourse[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      OR: offeredCourseSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // if (Object.keys(filtersData).length) {
  //   andCondition.push({
  //     AND: Object.entries(filtersData).map(([field, value]) => ({
  //       [field]: {
  //         equals: value,
  //       },
  //     })),
  //   });
  // }

  if (Object.keys(filtersData).length > 0) {
    andCondition.push({
      AND: Object.keys(filtersData).map(key => {
        if (offeredCourseRelationalFields.includes(key)) {
          return {
            [offeredCourseRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.OfferedCourseWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.offeredCourse.findMany({
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
  const total = await prisma.offeredCourse.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleOfferedCourse = async (
  id: string
): Promise<OfferedCourse | null> => {
  const result = await prisma.offeredCourse.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const updateOfferedCourse = async (
  id: string,
  payload: Partial<OfferedCourse>
): Promise<OfferedCourse | null> => {
  const result = await prisma.offeredCourse.update({
    where: {
      id,
    },
    data: payload,
  });
  if (result) {
    await RedisClient.publish(
      eventOfferedCourseUpdated,
      JSON.stringify(result)
    );
  }
  return result;
};
const deleteOfferedCourse = async (
  id: string
): Promise<OfferedCourse | null> => {
  const result = await prisma.offeredCourse.delete({
    where: { id },
  });

  if (result) {
    await RedisClient.publish(
      eventOfferedCourseDeleted,
      JSON.stringify(result)
    );
  }
  return result;
};

export const OfferedCourseService = {
  createOfferedCourse,
  getAllOfferedCourse,
  getSingleOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
};
