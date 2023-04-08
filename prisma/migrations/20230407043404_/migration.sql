/*
  Warnings:

  - You are about to drop the column `timetableCsv` on the `Timetable` table. All the data in the column will be lost.
  - Added the required column `timetableData` to the `Timetable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Timetable` DROP COLUMN `timetableCsv`,
    ADD COLUMN `timetableData` VARCHAR(191) NOT NULL;
