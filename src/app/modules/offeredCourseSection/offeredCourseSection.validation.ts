import { z } from 'zod';

const createOfferedCourseSectionZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    maxCapacity: z.number({
      required_error: 'Max capacity is required',
    }),
    offeredCourseId: z.string({
      required_error: 'Offered course id is required',
    }),
  }),
});

export const OfferedCourseSectionValidation = {
  createOfferedCourseSectionZodSchema,
};
