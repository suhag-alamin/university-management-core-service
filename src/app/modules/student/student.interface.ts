export type IStudentFilters = {
  searchTerm?: string;
  id?: string;
  bloodGroup?: string;
  email?: string;
  contactNo?: string;
  emergencyContactNo?: string;
};

export type name = { firstName: string; lastName: string; middleName: string };

export type IStudentCreatedEvent = {
  id: string;
  name: name;
  gender: string;
  dateOfBirth: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup: string;
  presentAddress: string;
  permanentAddress: string;
  academicSemester: Record<string, unknown>;
  academicDepartment: Record<string, unknown>;
  academicFaculty: Record<string, unknown>;
  guardian: Record<string, unknown>;
  localGuardian: Record<string, unknown>;
};
