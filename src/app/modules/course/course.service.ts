import { Course, CourseFaculty, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import { CourseSearchableFields } from './course.constant';
import {
  ICourse,
  ICourseFilters,
  IPreRequisiteCourse,
} from './course.interface';

const createCourse = async (data: ICourse): Promise<ICourse | any> => {
  const { preRequisiteCourses, ...courseData } = data;

  const newCourse = await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.course.create({
      data: courseData,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course');
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      await asyncForEach(
        preRequisiteCourses,
        async (preRequisiteCourse: IPreRequisiteCourse) => {
          await transactionClient.courseToPrerequisite.create({
            data: {
              courseId: result.id,
              preRequisiteId: preRequisiteCourse.courseId,
            },
          });
        }
      );
    }
    return result;
  });

  if (newCourse) {
    const responseData = await prisma.course.findUnique({
      where: {
        id: newCourse.id,
      },
      include: {
        prerequisite: {
          include: {
            preRequisite: true,
          },
        },
        prerequisiteFor: {
          include: {
            course: true,
          },
        },
      },
    });
    return responseData;
  }

  throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course');
};

const getAllCourses = async (
  filters: ICourseFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Course[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      OR: CourseSearchableFields.map(filed => ({
        [filed]: {
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

  const whereCondition: Prisma.CourseWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.course.findMany({
    where: whereCondition,
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
    include: {
      prerequisite: {
        include: {
          preRequisite: true,
        },
      },
      prerequisiteFor: {
        include: {
          course: true,
        },
      },
    },
  });

  const total = await prisma.course.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleCourse = async (id: string): Promise<Course | null> => {
  const result = await prisma.course.findUnique({
    where: {
      id,
    },
    include: {
      prerequisite: {
        include: {
          preRequisite: true,
        },
      },
      prerequisiteFor: {
        include: {
          course: true,
        },
      },
    },
  });
  return result;
};

const updateCourse = async (
  id: string,
  data: ICourse
): Promise<Course | null> => {
  // return result;
  const { preRequisiteCourses, ...courseData } = data;

  await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.course.update({
      where: {
        id,
      },
      data: courseData,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to update course');
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const deletePrerequisite = preRequisiteCourses.filter(
        coursePrerequisite =>
          coursePrerequisite.courseId && coursePrerequisite.isDeleted
      );

      const newPrerequisite = preRequisiteCourses.filter(
        coursePrerequisite =>
          coursePrerequisite.courseId && !coursePrerequisite.isDeleted
      );

      await asyncForEach(
        deletePrerequisite,
        async (deletePreCourse: IPreRequisiteCourse) => {
          await transactionClient.courseToPrerequisite.deleteMany({
            where: {
              AND: [
                {
                  courseId: id,
                },
                {
                  preRequisiteId: deletePreCourse.courseId,
                },
              ],
            },
          });
        }
      );

      await asyncForEach(
        newPrerequisite,
        async (newPreCourse: IPreRequisiteCourse) => {
          await transactionClient.courseToPrerequisite.create({
            data: {
              courseId: id,
              preRequisiteId: newPreCourse.courseId,
            },
          });
        }
      );

      return result;
    }
  });

  const responseData = await prisma.course.findUnique({
    where: {
      id,
    },
    include: {
      prerequisite: {
        include: {
          preRequisite: true,
        },
      },
      prerequisiteFor: {
        include: {
          course: true,
        },
      },
    },
  });
  return responseData;
};

const deleteCourse = async (id: string): Promise<Course | null> => {
  const deleteCourse = await prisma.$transaction(async transactionClient => {
    await transactionClient.courseToPrerequisite.deleteMany({
      where: {
        OR: [
          {
            courseId: id,
          },
          {
            preRequisiteId: id,
          },
        ],
      },
    });

    const result = await transactionClient.course.delete({
      where: {
        id,
      },
    });
    return result;
  });

  if (deleteCourse) {
    return deleteCourse;
  }

  throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to delete course');
};

const assignFaculties = async (
  id: string,
  data: string[]
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.createMany({
    data: data.map(facultyId => ({
      courseId: id,
      facultyId,
    })),
  });

  const assignFacultiesData = await prisma.courseFaculty.findMany({
    where: {
      courseId: id,
    },
    include: {
      course: true,
      faculty: true,
    },
  });
  return assignFacultiesData;
};

export const CourseService = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  assignFaculties,
};
