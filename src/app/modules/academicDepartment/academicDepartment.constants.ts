export const academicDepartmentFilterableFields = ['searchTerm', 'title'];

export const academicDepartmentSearchableFields = ['title'];

export const academicDepartmentRelationalFields: string[] = [
  'academicFacultyId',
];
export const academicDepartmentRelationalFieldsMapper: {
  [key: string]: string;
} = {
  academicFacultyId: 'academicFaculty',
};
export const eventAcademicDepartmentCreated = 'academic-department.created';
