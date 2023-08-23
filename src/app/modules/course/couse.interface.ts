type IPreRequisiteCourse = {
  courseId: string;
};

export type ICourse = {
  title: string;
  code: string;
  credits: number;
  preRequisiteCourses: IPreRequisiteCourse[];
};
