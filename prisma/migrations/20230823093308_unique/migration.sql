/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `buildings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facultyId]` on the table `faculties` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roomNumber]` on the table `rooms` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[floor]` on the table `rooms` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId]` on the table `students` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "buildings_title_key" ON "buildings"("title");

-- CreateIndex
CREATE UNIQUE INDEX "faculties_facultyId_key" ON "faculties"("facultyId");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_roomNumber_key" ON "rooms"("roomNumber");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_floor_key" ON "rooms"("floor");

-- CreateIndex
CREATE UNIQUE INDEX "students_studentId_key" ON "students"("studentId");
