-- DropForeignKey
ALTER TABLE "student_enrolled_course_marks" DROP CONSTRAINT "student_enrolled_course_marks_courseId_fkey";

-- AlterTable
ALTER TABLE "student_enrolled_course_marks" ALTER COLUMN "courseId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "student_enrolled_course_marks" ADD CONSTRAINT "student_enrolled_course_marks_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
