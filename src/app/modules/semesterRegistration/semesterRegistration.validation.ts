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

export const SemesterRegistrationValidation = {
  createSemesterRegistrationZodSchema,
};
