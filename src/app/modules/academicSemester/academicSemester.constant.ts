import {
  IAcademicSemesterCodes,
  IAcademicSemesterMonths,
  IAcademicSemesterTitles,
} from './academicSemester.interface';

export const academicSemesterTitle: IAcademicSemesterTitles[] = [
  'Autumn',
  'Summer',
  'Fall',
];

export const academicSemesterCodes: IAcademicSemesterCodes[] = [
  '01',
  '02',
  '03',
];

export const academicSemesterMonths: IAcademicSemesterMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const academicSemesterTitleCodeMapper: {
  [key: string]: string;
} = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};

export const academicSemesterSearchableFields = [
  'title',
  'code',
  'year',
  'startMonth',
  'endMonth',
];

export const academicSemesterFilterableFields = [
  'searchTerm',
  'title',
  'code',
  'year',
  'startMonth',
  'endMonth',
];
export const eventAcademicSemesterCreated = 'academic-semester.created';
export const eventAcademicSemesterUpdated = 'academic-semester.updated';
export const eventAcademicSemesterDeleted = 'academic-semester.deleted';
