/*
  Warnings:

  - The primary key for the `Announcement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `announcementId` on the `Announcement` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Announcement` DROP PRIMARY KEY,
    MODIFY `announcementId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`announcementId`);
