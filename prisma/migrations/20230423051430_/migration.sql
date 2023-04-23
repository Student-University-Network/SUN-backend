/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseId,lectureId]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Attendance_userId_courseId_lectureId_key` ON `Attendance`(`userId`, `courseId`, `lectureId`);
