import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';

import { CourseFaculty, Faculty, Prisma, Student } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../../shared/prisma';
import {
  IFacultyFilters,
  IFacultyMyCourseStudentsRequest,
} from './faculty.interface';
import {
  facultyRelationalFields,
  facultyRelationalFieldsMapper,
  facultySearchableFields,
} from './facuty.constant';

const createFaculty = async (data: Faculty): Promise<Faculty | null> => {
  const result = await prisma.faculty.create({
    data,
    include: {
      academicFaculty: true,
      academicDepartment: true,
    },
  });
  return result;
};

const getAllFaculties = async (
  filters: IFacultyFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Faculty[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      OR: facultySearchableFields.map(field => ({
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
        if (facultyRelationalFields.includes(key)) {
          return {
            [facultyRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.FacultyWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.faculty.findMany({
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
    },
  });
  const total = await prisma.faculty.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleFaculty = async (id: string): Promise<Faculty | null> => {
  const result = await prisma.faculty.findUnique({
    where: {
      id,
    },
    include: {
      academicDepartment: true,
      academicFaculty: true,
    },
  });
  return result;
};

const updateFaculty = async (
  id: string,
  payload: Partial<Faculty>
): Promise<Faculty | null> => {
  const result = await prisma.faculty.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteFaculty = async (id: string): Promise<Faculty | null> => {
  const result = await prisma.faculty.delete({
    where: {
      id,
    },
  });
  return result;
};

const assignCourses = async (
  facultyId: string,
  data: string[]
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.createMany({
    data: data.map(courseId => ({
      facultyId: facultyId,
      courseId,
    })),
  });

  const assignCoursesData = await prisma.courseFaculty.findMany({
    where: {
      facultyId: facultyId,
    },
    include: {
      faculty: true,
      course: true,
    },
  });
  return assignCoursesData;
};

const removeCourses = async (
  facultyId: string,
  data: string[]
): Promise<CourseFaculty[] | null> => {
  await prisma.courseFaculty.deleteMany({
    where: {
      facultyId: facultyId,
      courseId: {
        in: data,
      },
    },
  });

  const coursesData = await prisma.courseFaculty.findMany({
    where: {
      facultyId: facultyId,
    },
    include: {
      course: true,
      faculty: true,
    },
  });
  return coursesData;
};

const facultyCourses = async (
  user: JwtPayload | null,
  filter: {
    academicSemesterId?: string | null | undefined;
    courseId?: string | null | undefined;
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

  const offeredCourseSections = await prisma.offeredCourseSection.findMany({
    where: {
      offeredCourseClassSchedules: {
        some: {
          faculty: {
            facultyId: user?.id,
          },
        },
      },
      offeredCourse: {
        semesterRegistration: {
          academicSemester: {
            id: filter.academicSemesterId,
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
      offeredCourseClassSchedules: {
        include: {
          room: {
            include: {
              building: true,
            },
          },
        },
      },
    },
  });

  const courseAndSchedule = offeredCourseSections.reduce(
    (acc: any, obj: any) => {
      //console.log(obj)

      const course = obj.offeredCourse.course;
      const classSchedules = obj.offeredCourseClassSchedules;

      const existingCourse = acc.find(
        (item: any) => item.couse?.id === course?.id
      );
      if (existingCourse) {
        existingCourse.sections.push({
          section: obj,
          classSchedules,
        });
      } else {
        acc.push({
          course,
          sections: [
            {
              section: obj,
              classSchedules,
            },
          ],
        });
      }
      return acc;
    },
    []
  );
  return courseAndSchedule;
};

const getFacultyCourseStudents = async (
  filters: IFacultyMyCourseStudentsRequest,
  options: IPaginationOptions
  // user: any
): Promise<IGenericResponse<Student[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);

  if (!filters.academicSemesterId) {
    const currentAcademicSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });

    if (currentAcademicSemester) {
      filters.academicSemesterId = currentAcademicSemester.id;
    }
  }

  const offeredCourseSections =
    await prisma.studentSemesterRegistrationCourse.findMany({
      where: {
        offeredCourse: {
          course: {
            id: filters.courseId,
          },
        },
        offeredCourseSection: {
          offeredCourse: {
            semesterRegistration: {
              academicSemester: {
                id: filters.academicSemesterId,
              },
            },
          },
          id: filters.offeredCourseSectionId,
        },
      },
      include: {
        student: true,
        offeredCourse: {
          include: {
            course: true,
          },
        },
        offeredCourseSection: true,
      },
      take: limit,
      skip,
    });

  const students = offeredCourseSections.map(
    offeredCourseSection => offeredCourseSection.student
  );

  const total = await prisma.studentSemesterRegistrationCourse.count({
    where: {
      offeredCourse: {
        course: {
          id: filters.courseId,
        },
      },
      offeredCourseSection: {
        offeredCourse: {
          semesterRegistration: {
            academicSemester: {
              id: filters.academicSemesterId,
            },
          },
        },
        id: filters.offeredCourseSectionId,
      },
    },
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: students,
  };
};

const createFacultyFromEvent = async (e: any) => {
  const facultyData: Partial<Faculty> = {
    facultyId: e.id,
    firstName: e.name.firstName,
    middle: e.name.middleName,
    lastName: e.name.lastName,
    email: e.email,
    contactNo: e.contactNo,
    gender: e.gender,
    bloodGroup: e.bloodGroup,
    academicDepartmentId: e.academicDepartment.syncId,
    academicFacultyId: e.academicFaculty.syncId,
    designation: e.designation,
  };
  await createFaculty(facultyData as Faculty);
};
const updateFacultyFromEvent = async (e: any) => {
  const facultyData: Partial<Faculty> = {
    facultyId: e.id,
    firstName: e.name.firstName,
    middle: e.name.middleName,
    lastName: e.name.lastName,
    email: e.email,
    contactNo: e.contactNo,
    gender: e.gender,
    bloodGroup: e.bloodGroup,
    academicDepartmentId: e.academicDepartment.syncId,
    academicFacultyId: e.academicFaculty.syncId,
    designation: e.designation,
  };
  await prisma.faculty.update({
    where: {
      facultyId: e.id,
    },
    data: facultyData,
  });
};
const deleteFacultyFromEvent = async (e: any) => {
  await prisma.faculty.delete({
    where: {
      facultyId: e.id,
    },
  });
};

export const FacultyService = {
  createFaculty,
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
  assignCourses,
  removeCourses,
  facultyCourses,
  getFacultyCourseStudents,
  createFacultyFromEvent,
  updateFacultyFromEvent,
  deleteFacultyFromEvent,
};
