import { WeekDays } from '@prisma/client';

export type IClassSchedule = {
  startTime: string;
  endTime: string;
  dayOfWeek: WeekDays;
  roomId: string;
  facultyId: string;
};

export type ICreateOfferedCourseSection = {
  title: string;
  maxCapacity: number;
  offeredCourseId: string;
  // semesterRegistrationId?: string;
  classSchedules: IClassSchedule[];
};

export type IOfferedCourseSectionFilters = { searchTerm?: string };
