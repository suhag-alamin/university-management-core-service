export const offeredCourseSearchableFields = [];

export const offeredCourseFilterableFields = [
  'searchTerm',
  'id',
  'semesterRegistrationId',
  'courseId',
  'academicDepartmentId',
];

export const offeredCourseRelationalFields: string[] = [
  'semesterRegistrationId',
  'courseId',
  'academicDepartmentId',
];
export const offeredCourseRelationalFieldsMapper: { [key: string]: string } = {
  semesterRegistrationId: 'semesterRegistration',
  courseId: 'course',
  academicDepartmentId: 'academicDepartment',
};

export const eventOfferedCourseCreated = 'offered-course.created';
export const eventOfferedCourseUpdated = 'offered-course.updated';
export const eventOfferedCourseDeleted = 'offered-course.deleted';
