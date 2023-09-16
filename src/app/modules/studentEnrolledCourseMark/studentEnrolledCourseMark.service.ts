import { ExamType, PrismaClient } from '@prisma/client';
import {
  DefaultArgs,
  PrismaClientOptions,
} from '@prisma/client/runtime/library';

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
export const StudentEnrolledCourseMarkService = {
  createStudentEnrolledCourseDefaultMark,
};
