import { z } from 'zod';

const createStudentZodSchema = z.object({
  body: z.object({
    firstName: z.string({
      required_error: 'First name is required',
    }),
    lastName: z.string({
      required_error: 'Last name is required',
    }),
    middleName: z.string().optional(),

    gender: z.string({
      required_error: 'Gender is required',
    }),

    email: z
      .string({
        required_error: 'Email is required',
      })
      .email(),
    contactNo: z.string({
      required_error: 'Contact number is required',
    }),

    bloodGroup: z
      .string({
        required_error: 'Blood group is required',
      })
      .optional(),

    academicDepartment: z.object({
      connect: z.object({
        id: z.string({
          required_error: 'Academic Depart is required',
        }),
      }),
    }),
    academicSemester: z.object({
      connect: z.object({
        id: z.string({
          required_error: 'Academic Semester is required',
        }),
      }),
    }),

    academicFaculty: z.object({
      connect: z.object({
        id: z.string({
          required_error: 'Academic Faculty is required',
        }),
      }),
    }),

    profileImage: z
      .string({
        required_error: 'Profile Image is required',
      })
      .optional(),
  }),
});

const updateStudentZodSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    middleName: z.string().optional(),

    gender: z.string().optional(),

    email: z.string().email().optional(),
    contactNo: z.string().optional(),

    bloodGroup: z.string().optional(),

    academicDepartment: z
      .object({
        connect: z.object({
          id: z.string({}),
        }),
      })
      .optional(),
    academicSemester: z
      .object({
        connect: z.object({
          id: z.string(),
        }),
      })
      .optional(),

    academicFaculty: z
      .object({
        connect: z.object({
          id: z.string(),
        }),
      })
      .optional(),

    profileImage: z.string().optional(),
  }),
});

export const StudentValidation = {
  createStudentZodSchema,
  updateStudentZodSchema,
};
