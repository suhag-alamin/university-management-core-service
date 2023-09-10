import { z } from 'zod';
import { status } from './semesterRegistration.constant';

const createSemesterRegistrationZodSchema = z.object({
  body: z.object({
    startDate: z.string({
      required_error: 'Start date is required',
    }),
    endDate: z.string({
      required_error: 'End date is required',
    }),
    status: z
      .enum([...status] as [string, ...string[]], {
        required_error: 'Status is required',
      })
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
    status: z.enum([...status] as [string, ...string[]], {}).optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
    academicSemesterId: z.string().optional(),
  }),
});

export const SemesterRegistrationValidation = {
  createSemesterRegistrationZodSchema,
  updateSemesterRegistrationZodSchema,
};
