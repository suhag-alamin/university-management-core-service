import {
  ExamType,
  PrismaClient,
  StudentEnrolledCourseMark,
} from '@prisma/client';
import {
  DefaultArgs,
  PrismaClientOptions,
} from '@prisma/client/runtime/library';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { StudentEnrolledCourseMarkUtils } from './studentEnrolledCourseMark.utils';
import { IStudentEnrolledCourseMarkFilterRequest } from './studentEnrolledCourseMark.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';

const createStudentEnrolledCourseDefaultMark = async (
  transactionClient: Omit<
    PrismaClient<PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >,
  data: {
    studentId: string;
    studentEnrolledCourseId: string;
    academicSemesterId: string;
  }
) => {
  const isExistMidData =
    await transactionClient.studentEnrolledCourseMark.findFirst({
      where: {
        examType: ExamType.MIDTERM,
        student: {
          id: data.studentId,
        },
        studentEnrolledCourse: {
          id: data.studentEnrolledCourseId,
        },
        academicSemester: {
          id: data.academicSemesterId,
        },
      },
    });

  if (!isExistMidData) {
    await transactionClient.studentEnrolledCourseMark.create({
      data: {
        studentId: data.studentId,
        studentEnrolledCourseId: data.studentEnrolledCourseId,
        academicSemesterId: data.academicSemesterId,
        examType: ExamType.MIDTERM,
      },
    });
  }

  const isExistFinalData =
    await transactionClient.studentEnrolledCourseMark.findFirst({
      where: {
        examType: ExamType.FINAL,
        student: {
          id: data.studentId,
        },
        studentEnrolledCourse: {
          id: data.studentEnrolledCourseId,
        },
        academicSemester: {
          id: data.academicSemesterId,
        },
      },
    });

  if (!isExistFinalData) {
    await transactionClient.studentEnrolledCourseMark.create({
      data: {
        studentId: data.studentId,
        studentEnrolledCourseId: data.studentEnrolledCourseId,
        academicSemesterId: data.academicSemesterId,
        examType: ExamType.FINAL,
      },
    });
  }
};

const getAllStudentMarks = async (
  filters: IStudentEnrolledCourseMarkFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<StudentEnrolledCourseMark[]>> => {
  const { limit, page } = paginationHelpers.calculatePagination(options);

  const marks = await prisma.studentEnrolledCourseMark.findMany({
    where: {
      student: {
        id: filters.studentId,
      },
      academicSemester: {
        id: filters.academicSemesterId,
      },
      studentEnrolledCourse: {
        course: {
          id: filters.courseId,
        },
      },
    },
    include: {
      studentEnrolledCourse: {
        include: {
          course: true,
        },
      },
      student: true,
    },
  });

  return {
    meta: {
      total: marks.length,
      page,
      limit,
    },
    data: marks,
  };
};

const updateStudentMark = async (data: any) => {
  const { studentId, academicSemesterId, courseId, examType, marks } = data;

  const studentEnrolledCourseMarks =
    await prisma.studentEnrolledCourseMark.findFirst({
      where: {
        student: {
          id: studentId,
        },
        academicSemester: {
          id: academicSemesterId,
        },
        studentEnrolledCourse: {
          course: {
            id: courseId,
          },
        },
        examType,
      },
    });

  if (!studentEnrolledCourseMarks) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Student enrolled course mark not found!'
    );
  }
  const result = StudentEnrolledCourseMarkUtils.getGradeFromMarks(marks);

  const updateStudentMarks = await prisma.studentEnrolledCourseMark.update({
    where: {
      id: studentEnrolledCourseMarks.id,
    },
    data: {
      marks,
      grade: result.grade,
    },
  });

  return updateStudentMarks;
};

export const StudentEnrolledCourseMarkService = {
  createStudentEnrolledCourseDefaultMark,
  getAllStudentMarks,
  updateStudentMark,
};
