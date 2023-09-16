import { SemesterRegistrationStatus } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { IEnrollIntoCourse } from '../semesterRegistration/semesterRegistration.interface';

const enrollIntoCourse = async (userId: string, data: IEnrollIntoCourse) => {
  const student = await prisma.student.findFirst({
    where: {
      studentId: userId,
    },
  });

  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  const offeredCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: data.offeredCourseId,
    },
    include: {
      course: true,
    },
  });
  const offeredCourseSection = await prisma.offeredCourseSection.findFirst({
    where: {
      id: data.offeredCourseSectionId,
    },
  });

  if (
    !student ||
    !semesterRegistration ||
    !offeredCourse ||
    !offeredCourseSection
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      !student
        ? 'Student Not Found!'
        : !semesterRegistration
        ? 'No semester registration is ongoing now!'
        : !offeredCourse
        ? 'No offered course found'
        : !offeredCourseSection
        ? 'No Section Found for this course!'
        : 'Something went wrong!'
    );
  }

  if (
    offeredCourseSection.maxCapacity &&
    offeredCourseSection.currentlyEnrolledStudent &&
    offeredCourseSection.currentlyEnrolledStudent >=
      offeredCourseSection.maxCapacity
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student Capacity is full');
  }

  await prisma.$transaction(async transactionClient => {
    await transactionClient.studentSemesterRegistrationCourse.create({
      data: {
        studentId: student?.id,
        semesterRegistrationId: semesterRegistration?.id,
        offeredCourseId: data?.offeredCourseId,
        offeredCourseSectionId: data?.offeredCourseSectionId,
      },
    });

    await transactionClient.offeredCourseSection.update({
      where: {
        id: data.offeredCourseSectionId,
      },
      data: {
        currentlyEnrolledStudent: {
          increment: 1,
        },
      },
    });

    await transactionClient.studentSemesterRegistration.updateMany({
      where: {
        student: {
          id: student.id,
        },
        semesterRegistration: {
          id: semesterRegistration.id,
        },
      },
      data: {
        totalCreditsTaken: {
          increment: offeredCourse.course.credits,
        },
      },
    });
  });
};

const withdrawFromCourse = async (userId: string, data: IEnrollIntoCourse) => {
  const student = await prisma.student.findFirst({
    where: {
      studentId: userId,
    },
  });

  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  const offeredCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: data.offeredCourseId,
    },
    include: {
      course: true,
    },
  });

  if (!student || !semesterRegistration || !offeredCourse) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      !student
        ? 'Student Not Found!'
        : !semesterRegistration
        ? 'No semester registration is ongoing now!'
        : !offeredCourse
        ? 'No offered course found'
        : 'Something went wrong!'
    );
  }

  await prisma.$transaction(async transactionClient => {
    await transactionClient.studentSemesterRegistrationCourse.delete({
      where: {
        semesterRegistrationId_studentId_offeredCourseId: {
          semesterRegistrationId: semesterRegistration?.id,
          studentId: student?.id,
          offeredCourseId: data?.offeredCourseId,
        },
      },
    });

    await transactionClient.offeredCourseSection.update({
      where: {
        id: data.offeredCourseSectionId,
      },
      data: {
        currentlyEnrolledStudent: {
          decrement: 1,
        },
      },
    });

    await transactionClient.studentSemesterRegistration.updateMany({
      where: {
        student: {
          id: student.id,
        },
        semesterRegistration: {
          id: semesterRegistration.id,
        },
      },
      data: {
        totalCreditsTaken: {
          decrement: offeredCourse.course.credits,
        },
      },
    });
  });
};

const confirmStudentRegistration = async (userId: string) => {
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  const studentSemesterRegistration =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        semesterRegistration: {
          id: semesterRegistration?.id,
        },
        student: {
          studentId: userId,
        },
      },
    });

  if (!studentSemesterRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      !studentSemesterRegistration
        ? 'You did not have any registration'
        : 'Something went wrong!'
    );
  }

  if (studentSemesterRegistration.totalCreditsTaken === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You are not enrolled in any course`
    );
  }

  if (
    studentSemesterRegistration?.totalCreditsTaken &&
    semesterRegistration?.minCredit &&
    semesterRegistration?.maxCredit &&
    (studentSemesterRegistration.totalCreditsTaken <
      semesterRegistration.minCredit ||
      studentSemesterRegistration.totalCreditsTaken >
        semesterRegistration.maxCredit)
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You can only take between ${semesterRegistration.minCredit} to ${semesterRegistration.maxCredit} credits.`
    );
  }

  await prisma.studentSemesterRegistration.update({
    where: {
      id: studentSemesterRegistration.id,
    },
    data: {
      isConfirmed: true,
    },
  });
};

const getStudentRegistration = async (userId: string) => {
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
    include: {
      academicSemester: true,
    },
  });

  const studentSemesterRegistration =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        semesterRegistration: {
          id: semesterRegistration?.id,
        },
        student: {
          studentId: userId,
        },
      },
      include: {
        student: true,
      },
    });

  return { semesterRegistration, studentSemesterRegistration };
};

export const studentSemesterRegistrationCourseService = {
  enrollIntoCourse,
  withdrawFromCourse,
  confirmStudentRegistration,
  getStudentRegistration,
};
