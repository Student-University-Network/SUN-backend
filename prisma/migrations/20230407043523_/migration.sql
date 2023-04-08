/*
  Warnings:

  - The primary key for the `Timetable` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `timetableId` on the `Timetable` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Timetable` DROP PRIMARY KEY,
    MODIFY `timetableId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`timetableId`);
