import { ExamType } from '@prisma/client';
import { z } from 'zod';

const updateStudentMarksZodSchema = z.object({
  body: z.object({
    academicSemesterId: z.string({
      required_error: 'Academic semester id is required',
    }),
    studentId: z.string({
      required_error: 'Student id is required',
    }),
    courseId: z.string({
      required_error: 'Course id is required',
    }),
    examType: z.enum([...Object.values(ExamType)] as [string, ...string[]], {}),
    marks: z
      .number({
        required_error: 'Marks is required',
      })
      .max(100)
      .min(0),
  }),
});

const updateStudentCourseFinalMarksZodSchema = z.object({
  body: z.object({
    academicSemesterId: z.string({
      required_error: 'Academic semester id is required',
    }),
    studentId: z.string({
      required_error: 'Student id is required',
    }),
    courseId: z.string({
      required_error: 'Course id is required',
    }),
  }),
});

export const StudentEnrolledCourseMarkValidation = {
  updateStudentMarksZodSchema,
  updateStudentCourseFinalMarksZodSchema,
};
