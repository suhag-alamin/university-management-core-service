import { AcademicDepartment, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { academicDepartmentSearchableFields } from './academicDepartment.constants';
import { IAcademicDepartmentFilters } from './academicDepartment.interface';
import prisma from '../../../shared/prisma';

const createAcademicDepartment = async (
  data: AcademicDepartment
): Promise<AcademicDepartment | null> => {
  console.log(data);
  const result = await prisma.academicDepartment.create({
    data,
  });
  return result;
};

const getAllAcademicDepartments = async (
  filters: IAcademicDepartmentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<AcademicDepartment[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      OR: academicDepartmentSearchableFields.map(field => ({
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

  const whereCondition: Prisma.AcademicDepartmentWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.academicDepartment.findMany({
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
  });
  const total = await prisma.academicDepartment.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleAcademicDepartment = async (
  id: string
): Promise<AcademicDepartment | null> => {
  const result = await prisma.academicDepartment.findUnique({
    where: {
      id,
    },
  });
  return result;
};

// const updateAcademicDepartment = async (
//   id: string,
//   payload: Partial<AcademicDepartment>
// ): Promise<AcademicDepartment | null> => {
//   const result = await AcademicDepartment.findOneAndUpdate(
//     { _id: id },
//     payload,
//     {
//       new: true,
//     }
//   ).populate('academicFaculty');
//   return result;
// };

// const deleteAcademicDepartment = async (
//   id: string
// ): Promise<IAcademicDepartment | null> => {
//   const result = await AcademicDepartment.findByIdAndDelete(id);
//   return result;
// };

export const AcademicDepartmentService = {
  createAcademicDepartment,
  getAllAcademicDepartments,
  getSingleAcademicDepartment,
  // updateAcademicDepartment,
  // deleteAcademicDepartment,
};
