/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-dgetAllFacultiesisable @typescript-eslint/no-explicit-any */
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';

import { Faculty, Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IFacultyFilters } from './faculty.interface';
import { facultySearchableFields } from './facuty.constant';

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

  if (Object.keys(filtersData).length) {
    andCondition.push({
      AND: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
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

// const updateFaculty = async (
//   id: string,
//   payload: Partial<IFaculty>
// ): Promise<IFaculty | null> => {
//   const isExist = await Faculty.findOne({ id });

//   if (!isExist) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found !');
//   }

//   const { name, ...FacultyData } = payload;
//   const updatedFacultyData: Partial<IFaculty> = { ...FacultyData };

//   if (name && Object.keys(name).length > 0) {
//     Object.keys(name).forEach(key => {
//       const nameKey = `name.${key}` as keyof Partial<IFaculty>;
//       (updatedFacultyData as any)[nameKey] = name[key as keyof typeof name];
//     });
//   }

//   const result = await Faculty.findOneAndUpdate({ id }, updatedFacultyData, {
//     new: true,
//   });
//   return result;
// };

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

export const FacultyService = {
  createFaculty,
  getAllFaculties,
  getSingleFaculty,
  // updateFaculty,
  // deleteFaculty,
};
