/*
  Warnings:

  - Added the required column `batchId` to the `FirebaseToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `FirebaseToken` ADD COLUMN `batchId` VARCHAR(191) NOT NULL;
