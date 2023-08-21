/*
  Warnings:

  - Added the required column `test` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "students" ADD COLUMN     "test" TEXT NOT NULL;
