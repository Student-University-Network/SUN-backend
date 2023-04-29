/*
  Warnings:

  - The primary key for the `Program` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Program` table. All the data in the column will be lost.
  - The primary key for the `Semester` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Semester` table. All the data in the column will be lost.
  - Added the required column `endYear` to the `Program` table without a default value. This is not possible if the table is not empty.
  - The required column `programId` was added to the `Program` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `startYear` to the `Program` table without a default value. This is not possible if the table is not empty.
  - The required column `semesterId` was added to the `Semester` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `Program` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `endYear` DATETIME(3) NOT NULL,
    ADD COLUMN `programId` VARCHAR(191) NOT NULL,
    ADD COLUMN `startYear` DATETIME(3) NOT NULL,
    ADD COLUMN `tag` VARCHAR(191) NOT NULL DEFAULT '',
    ADD PRIMARY KEY (`programId`);

-- AlterTable
ALTER TABLE `Semester` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `semesterId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`semesterId`);
