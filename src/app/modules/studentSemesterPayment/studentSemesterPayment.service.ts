import { Prisma, PrismaClient, StudentSemesterPayment } from '@prisma/client';
import {
  DefaultArgs,
  PrismaClientOptions,
} from '@prisma/client/runtime/library';
import { IStudentSemesterPaymentFilterRequest } from './studentSemesterPayment.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import {
  studentSemesterPaymentRelationalFields,
  studentSemesterPaymentRelationalFieldsMapper,
  studentSemesterPaymentSearchableFields,
} from './studentSemesterPayment.constant';
import prisma from '../../../shared/prisma';

const createSemesterPayment = async (
  transactionClient: Omit<
    PrismaClient<PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >,
  data: {
    studentId: string;
    academicSemesterId: string;
    totalPaymentAmount: number;
  }
) => {
  const isExist = await transactionClient.studentSemesterPayment.findFirst({
    where: {
      student: {
        id: data.studentId,
      },
      academicSemester: {
        id: data.academicSemesterId,
      },
    },
  });

  if (!isExist) {
    const dataToInsert = {
      studentId: data.studentId,
      academicSemesterId: data.academicSemesterId,
      fullPayment: data.totalPaymentAmount,
      partialPayment: data.totalPaymentAmount * 0.5,
      totalDueAmount: data.totalPaymentAmount,
      totalPaidAmount: 0,
    };

    await transactionClient.studentSemesterPayment.create({
      data: dataToInsert,
    });
  }
};

const getAllStudentSemesterPayment = async (
  filters: IStudentSemesterPaymentFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<StudentSemesterPayment[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: studentSemesterPaymentSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (studentSemesterPaymentRelationalFields.includes(key)) {
          return {
            [studentSemesterPaymentRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.StudentSemesterPaymentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.studentSemesterPayment.findMany({
    include: {
      academicSemester: true,
      student: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.studentSemesterPayment.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const StudentSemesterPaymentService = {
  createSemesterPayment,
  getAllStudentSemesterPayment,
};
