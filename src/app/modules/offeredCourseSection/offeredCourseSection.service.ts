import {
  OfferedCourseClassSchedule,
  OfferedCourseSection,
  Prisma,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import { OfferedCourseClassScheduleUtils } from '../offeredCourseClassSchedule/offeredCourseClassSchedule.utils';
import {
  eventOfferedCourseSectionCreated,
  eventOfferedCourseSectionDeleted,
  eventOfferedCourseSectionUpdated,
  offeredCourseSectionRelationalFields,
  offeredCourseSectionRelationalFieldsMapper,
  offeredCourseSectionSearchableFields,
} from './offeredCourseSection.constant';
import {
  IClassSchedule,
  ICreateOfferedCourseSection,
  IOfferedCourseSectionFilters,
} from './offeredCourseSection.interface';
import { RedisClient } from '../../../shared/redis';

const createOfferedSectionCourse = async (
  payload: ICreateOfferedCourseSection
): Promise<OfferedCourseSection | null> => {
  const { classSchedules, ...data } = payload;

  const isExistOfferedCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: data.offeredCourseId,
    },
  });

  if (!isExistOfferedCourse) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Offered course does not exist');
  }

  // data.semesterRegistrationId = isExistOfferedCourse.semesterRegistrationId;

  await asyncForEach(
    classSchedules,
    async (schedule: OfferedCourseClassSchedule) => {
      await OfferedCourseClassScheduleUtils.checkRoomAvailability(schedule);
      await OfferedCourseClassScheduleUtils.checkFacultyAvailability(schedule);
    }
  );

  const offeredCourseSectionData = await prisma.offeredCourseSection.findFirst({
    where: {
      offeredCourse: {
        id: data.offeredCourseId,
      },
      title: data.title,
    },
  });

  if (offeredCourseSectionData) {
    throw new ApiError(httpStatus.BAD_GATEWAY, 'Course section already exist');
  }

  const createSection = await prisma.$transaction(async transactionClient => {
    const createOfferedSection =
      await transactionClient.offeredCourseSection.create({
        data: {
          title: data.title,
          maxCapacity: data.maxCapacity,
          offeredCourseId: data.offeredCourseId,
          semesterRegistrationId: isExistOfferedCourse.semesterRegistrationId,
        },
      });

    const scheduleData = classSchedules.map((schedule: IClassSchedule) => ({
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      dayOfWeek: schedule.dayOfWeek,
      roomId: schedule.roomId,
      facultyId: schedule.facultyId,
      offeredCourseSectionId: createOfferedSection.id,
      semesterRegistrationId: isExistOfferedCourse.semesterRegistrationId,
    }));

    await transactionClient.offeredCourseClassSchedule.createMany({
      data: scheduleData,
    });
    return createOfferedSection;
  });

  const result = await prisma.offeredCourseSection.findFirst({
    where: {
      id: createSection.id,
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      offeredCourseClassSchedules: {
        include: {
          room: {
            include: {
              building: true,
            },
          },
          faculty: true,
        },
      },
    },
  });

  if (result) {
    await RedisClient.publish(
      eventOfferedCourseSectionCreated,
      JSON.stringify(result)
    );
  }

  return result;
};

const getAllOfferedCourseSection = async (
  filters: IOfferedCourseSectionFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<OfferedCourseSection[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      OR: offeredCourseSectionSearchableFields.map(field => ({
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
        if (offeredCourseSectionRelationalFields.includes(key)) {
          return {
            [offeredCourseSectionRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.OfferedCourseSectionWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.offeredCourseSection.findMany({
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
  const total = await prisma.offeredCourseSection.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleOfferedCourseSection = async (
  id: string
): Promise<OfferedCourseSection | null> => {
  const result = await prisma.offeredCourseSection.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const updateOfferedCourseSection = async (
  id: string,
  payload: Partial<OfferedCourseSection>
): Promise<OfferedCourseSection | null> => {
  const result = await prisma.offeredCourseSection.update({
    where: {
      id,
    },
    data: payload,
  });

  if (result) {
    await RedisClient.publish(
      eventOfferedCourseSectionUpdated,
      JSON.stringify(result)
    );
  }

  return result;
};
const deleteOfferedCourseSection = async (
  id: string
): Promise<OfferedCourseSection | null> => {
  const result = await prisma.offeredCourseSection.delete({
    where: { id },
  });

  if (result) {
    await RedisClient.publish(
      eventOfferedCourseSectionDeleted,
      JSON.stringify(result)
    );
  }

  return result;
};

export const OfferedCourseSectionService = {
  createOfferedSectionCourse,
  getAllOfferedCourseSection,
  getSingleOfferedCourseSection,
  updateOfferedCourseSection,
  deleteOfferedCourseSection,
};
