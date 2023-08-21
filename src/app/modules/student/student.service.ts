/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-dgetAllFacultiesisable @typescript-eslint/no-explicit-any */
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';

import { Prisma, Student } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { studentSearchableFields } from './student.constant';
import { IStudentFilters } from './student.interface';

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

  if (Object.keys(filtersData).length) {
    andCondition.push({
      AND: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
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
  // const isExist = await Faculty.findOne({ id });
  // if (!isExist) {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found !');
  // }
  // const { name, ...FacultyData } = payload;
  // const updatedFacultyData: Partial<IFaculty> = { ...FacultyData };
  // if (name && Object.keys(name).length > 0) {
  //   Object.keys(name).forEach(key => {
  //     const nameKey = `name.${key}` as keyof Partial<IFaculty>;
  //     (updatedFacultyData as any)[nameKey] = name[key as keyof typeof name];
  //   });
  // }
  // const result = await Faculty.findOneAndUpdate({ id }, updatedFacultyData, {
  //   new: true,
  // });
  // return result;
  const result = await prisma.student.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

// const deleteFaculty = async (id: string): Promise<IFaculty | null> => {
//   // check if the faculty is exist
//   const isExist = await Faculty.findOne({ id });

//   if (!isExist) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found !');
//   }

//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();
//     //delete faculty first
//     const faculty = await Faculty.findOneAndDelete({ id }, { session });
//     if (!faculty) {
//       throw new ApiError(404, 'Failed to delete student');
//     }
//     //delete user
//     await User.deleteOne({ id });
//     session.commitTransaction();
//     session.endSession();

//     return faculty;
//   } catch (error) {
//     session.abortTransaction();
//     throw error;
//   }
// };

export const StudentService = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  updateStudent,
  // deleteFaculty,
};
