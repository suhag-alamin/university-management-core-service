type IPreRequisiteCourse = {
  courseId: string;
  isDeleted?: null;
};

export type ICourse = {
  title: string;
  code: string;
  credits: number;
  preRequisiteCourses: IPreRequisiteCourse[];
};

export type ICourseFilters = {
  searchTerm?: string;
  title?: string;
  code?: string;
};
