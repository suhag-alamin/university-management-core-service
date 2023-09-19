export const semesterRegistrationFilterableFields = [
  'searchTerm',
  'id',
  'academicSemesterId',
];
export const semesterRegistrationSearchableFields = [];

export const semesterRegistrationRelationalFields: string[] = [
  'academicSemesterId',
];
export const semesterRegistrationRelationalFieldsMapper: {
  [key: string]: string;
} = {
  academicSemesterId: 'academicSemester',
};

export const eventSemesterRegistrationCreated = 'semester-registration.created';
export const eventSemesterRegistrationUpdated = 'semester-registration.updated';
export const eventSemesterRegistrationDeleted = 'semester-registration.deleted';
