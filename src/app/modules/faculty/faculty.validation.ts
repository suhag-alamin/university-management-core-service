import { z } from 'zod';

const createFacultyZodSchema = z.object({
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

    academicDepartmentId: z.string({
      required_error: 'Academic Depart is required',
    }),

    academicFacultyId: z.string({
      required_error: 'Academic Faculty is required',
    }),

    designation: z.string({
      required_error: 'Designation is required',
    }),
    profileImage: z
      .string({
        required_error: 'Profile Image is required',
      })
      .optional(),
  }),
});

const updateFacultyZodSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    middleName: z.string().optional(),

    gender: z.string().optional(),

    email: z.string().email().optional(),
    contactNo: z.string().optional(),

    bloodGroup: z.string().optional().optional(),

    academicDepartmentId: z.string().optional(),

    academicFacultyId: z.string().optional(),
    designation: z.string().optional(),
    profileImage: z.string().optional(),
  }),
});

const createAssignCoursesZodSchema = z.object({
  body: z.object({
    courses: z.string({}).array(),
  }),
});
const updateAssignCoursesZodSchema = z.object({
  body: z.object({
    courses: z.string({}).array(),
  }),
});

export const FacultyValidation = {
  createFacultyZodSchema,
  updateFacultyZodSchema,
  createAssignCoursesZodSchema,
  updateAssignCoursesZodSchema,
};
