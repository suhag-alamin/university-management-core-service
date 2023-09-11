import { OfferedCourse } from '@prisma/client';
import { ICreateOfferedCourse } from './offeredCourse.interface';
import { asyncForEach } from '../../../shared/utils';
import prisma from '../../../shared/prisma';

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
  return result;
};

export const OfferedCourseService = {
  createOfferedCourse,
};
