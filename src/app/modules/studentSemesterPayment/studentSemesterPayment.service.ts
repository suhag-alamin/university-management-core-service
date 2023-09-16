import { PrismaClient } from '@prisma/client';
import {
  DefaultArgs,
  PrismaClientOptions,
} from '@prisma/client/runtime/library';

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
      fullPaymentAmount: data.totalPaymentAmount,
      partialPaymentAmount: data.totalPaymentAmount * 0.5,
      totalDueAmount: data.totalPaymentAmount,
      totalPaidAmount: 0,
    };

    await transactionClient.studentSemesterPayment.create({
      data: dataToInsert,
    });
  }
};

export const StudentSemesterPaymentService = {
  createSemesterPayment,
};
