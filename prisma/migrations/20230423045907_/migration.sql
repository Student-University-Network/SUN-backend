/*
  Warnings:

  - You are about to alter the column `attended` on the `Attendance` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `Attendance` MODIFY `attended` ENUM('PRESENT', 'ABSENT') NOT NULL DEFAULT 'ABSENT';
