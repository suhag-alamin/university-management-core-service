export const studentEnrolledCourseMarkFilterableFields: string[] = [
  'academicSemesterId',
  'studentId',
  'studentEnrolledCourseId',
  'examType',
  'courseId',
];

export const studentEnrolledCourseMarkSearchableFields: string[] = [
  'examType',
  'grade',
];

export const studentEnrolledCourseMarkRelationalFields: string[] = [
  'academicSemesterId',
  'studentId',
  'studentEnrolledCourseId',
];
export const studentEnrolledCourseMarkRelationalFieldsMapper: {
  [key: string]: string;
} = {
  academicSemesterId: 'academicSemester',
  studentId: 'student',
  studentEnrolledCourseId: 'studentEnrolledCourse',
};

export const eventStudentEnrolledCourseMarkCreated =
  'student-enrolled-course-mark.created';
export const eventStudentEnrolledCourseMarkMidUpdated =
  'student-enrolled-course-mark-mid.updated';
export const eventStudentEnrolledCourseMarkFinalUpdated =
  'student-enrolled-course-mark-final.updated';
export const eventStudentEnrolledCourseMarkDeleted =
  'student-enrolled-course-mark.deleted';
