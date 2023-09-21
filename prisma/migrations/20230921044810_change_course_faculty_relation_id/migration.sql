-- DropForeignKey
ALTER TABLE "course_faculties" DROP CONSTRAINT "course_faculties_facultyId_fkey";

-- AddForeignKey
ALTER TABLE "course_faculties" ADD CONSTRAINT "course_faculties_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties"("facultyId") ON DELETE RESTRICT ON UPDATE CASCADE;
