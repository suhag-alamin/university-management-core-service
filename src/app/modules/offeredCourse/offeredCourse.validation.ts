import { z } from 'zod';

const createOfferedCourseZodSchema = z.object({
  body: z.object({
    academicDepartmentId: z.string({
      required_error: 'Academic Department id is required',
    }),
    semesterRegistrationId: z.string({
      required_error: 'Semester Registration id is required',
    }),
    courseIds: z.array(z.string(), {
      required_error: 'Course Ids are required',
    }),
  }),
});
const updateOfferedCourseZodSchema = z.object({
  body: z.object({
    academicDepartmentId: z.string().optional(),
    semesterRegistrationId: z.string().optional(),
    courseIds: z.array(z.string()).optional(),
  }),
});

export const OfferedCourseValidation = {
  createOfferedCourseZodSchema,
  updateOfferedCourseZodSchema,
};
