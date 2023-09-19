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

export const eventOfferedCourseSectionCreated =
  'offered-course-section.created';
export const eventOfferedCourseSectionUpdated =
  'offered-course-section.updated';
export const eventOfferedCourseSectionDeleted =
  'offered-course-section.deleted';
