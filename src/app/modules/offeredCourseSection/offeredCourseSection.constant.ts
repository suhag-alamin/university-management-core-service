export const offeredCourseSectionSearchableFields = ['title'];

export const offeredCourseSectionFilterableFields = [
  'searchTerm',
  'id',
  'offeredCourseId',
  'semesterRegistrationId',
];

export const offeredCourseSectionRelationalFields: string[] = [
  'offeredCourseId',
  'semesterRegistrationId',
];
export const offeredCourseSectionRelationalFieldsMapper: {
  [key: string]: string;
} = {
  offeredCourseId: 'offeredCourse',
  semesterRegistrationId: 'semesterRegistration',
};
