export type ICreateOfferedCourseSection = {
  title: string;
  maxCapacity: number;
  offeredCourseId: string;
  semesterRegistrationId?: string;
};
