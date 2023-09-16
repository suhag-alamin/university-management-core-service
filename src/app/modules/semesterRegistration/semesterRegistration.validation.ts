import { SemesterRegistrationStatus } from '@prisma/client';
import { z } from 'zod';

const createSemesterRegistrationZodSchema = z.object({
  body: z.object({
    startDate: z.string({
      required_error: 'Start date is required',
    }),
    endDate: z.string({
      required_error: 'End date is required',
    }),
    status: z
      .enum(
        [...Object.values(SemesterRegistrationStatus)] as [string, ...string[]],
        {
          required_error: 'Status is required',
        }
      )
      .default('UPCOMING'),
    minCredit: z.number({
      required_error: 'Minimum credit is required',
    }),
    maxCredit: z.number({
      required_error: 'Maximum credit is required',
    }),
    academicSemesterId: z.string({
      required_error: 'Academic semester id is required',
    }),
  }),
});
const updateSemesterRegistrationZodSchema = z.object({
  body: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: z
      .enum(
        [...Object.values(SemesterRegistrationStatus)] as [string, ...string[]],
        {}
      )
      .optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
    academicSemesterId: z.string().optional(),
  }),
});

const enrollOrWithdrawCourseZodSchema = z.object({
  body: z.object({
    offeredCourseId: z.string({
      required_error: 'Offered course id is required',
    }),
    offeredCourseSectionId: z.string({
      required_error: 'Offered course Section id is required',
    }),
  }),
});

export const SemesterRegistrationValidation = {
  createSemesterRegistrationZodSchema,
  updateSemesterRegistrationZodSchema,
  enrollOrWithdrawCourseZodSchema,
};
