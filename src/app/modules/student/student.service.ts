/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-dgetAllFacultiesisable @typescript-eslint/no-explicit-any */
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';

import { Prisma, Student, StudentEnrolledCourseStatus } from '@prisma/client';
import prisma from '../../../shared/prisma';
import {
  studentRelationalFields,
  studentRelationalFieldsMapper,
  studentSearchableFields,
} from './student.constant';
import { IStudentFilters } from './student.interface';
import { StudentUtils } from './student.utils';

const createStudent = async (data: Student): Promise<Student | null> => {
  const result = await prisma.student.create({
    data,
    include: {
      academicDepartment: true,
      academicFaculty: true,
      academicSemester: true,
    },
  });
  return result;
};

const getAllStudents = async (
  filters: IStudentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Student[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      OR: studentSearchableFields.map(field => ({
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
  //       [field]: value,
  //     })),
  //   });
  // }

  if (Object.keys(filtersData).length > 0) {
    andCondition.push({
      AND: Object.keys(filtersData).map(key => {
        if (studentRelationalFields.includes(key)) {
          return {
            [studentRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.StudentWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.student.findMany({
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
    include: {
      academicDepartment: true,
      academicFaculty: true,
      academicSemester: true,
    },
  });
  const total = await prisma.student.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleStudent = async (id: string): Promise<Student | null> => {
  const result = await prisma.student.findUnique({
    where: {
      id,
    },
    include: {
      academicDepartment: true,
      academicFaculty: true,
      academicSemester: true,
    },
  });
  return result;
};

const updateStudent = async (
  id: string,
  payload: Partial<Student>
): Promise<Student | null> => {
  const result = await prisma.student.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteStudent = async (id: string): Promise<Student | null> => {
  const result = await prisma.student.delete({
    where: { id },
  });

  return result;
};

const studentCourses = async (
  userId: string,
  filter: {
    courseId?: string;
    academicSemesterId?: string;
  }
) => {
  if (!filter.academicSemesterId) {
    const currentSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });
    filter.academicSemesterId = currentSemester?.id;
  }

  const result = await prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        studentId: userId,
      },
      ...filter,
    },
    include: {
      course: true,
    },
  });

  return result;
};

const getStudentCourseSchedules = async (
  userId: string,
  filter: {
    courseId?: string | undefined;
    academicSemesterId?: string | undefined;
  }
) => {
  if (!filter.academicSemesterId) {
    const currentSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });
    filter.academicSemesterId = currentSemester?.id;
  }

  const studentEnrolledCourses = await studentCourses(userId, filter);
  const studentEnrolledCourseIds = studentEnrolledCourses.map(
    item => item.courseId
  );
  const result = await prisma.studentSemesterRegistrationCourse.findMany({
    where: {
      student: {
        studentId: userId,
      },
      semesterRegistration: {
        academicSemester: {
          id: filter.academicSemesterId,
        },
      },
      offeredCourse: {
        course: {
          id: {
            in: studentEnrolledCourseIds,
          },
        },
      },
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      offeredCourseSection: {
        include: {
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
      },
    },
  });
  return result;
};

const studentMyAcademicInfo = async (userId: string): Promise<any> => {
  const academicInfo = await prisma.studentAcademicInfo.findFirst({
    where: {
      student: {
        studentId: userId,
      },
    },
  });

  const enrolledCourses = await prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        studentId: userId,
      },
      status: StudentEnrolledCourseStatus.COMPLETED,
    },
    include: {
      course: true,
      academicSemester: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const groupByAcademicSemesterData =
    StudentUtils.groupByAcademicSemester(enrolledCourses);

  return {
    academicInfo,
    courses: groupByAcademicSemesterData,
  };
};

export const StudentService = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
  studentCourses,
  getStudentCourseSchedules,
  studentMyAcademicInfo,
};
