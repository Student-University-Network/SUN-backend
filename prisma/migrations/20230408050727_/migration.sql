/*
  Warnings:

  - You are about to alter the column `timetableData` on the `Timetable` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `Timetable` MODIFY `timetableData` JSON NOT NULL;
