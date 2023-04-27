/*
  Warnings:

  - You are about to drop the column `batchId` on the `FirebaseToken` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `FirebaseToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `FirebaseToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `FirebaseToken_userId_key` ON `FirebaseToken`;

-- AlterTable
ALTER TABLE `FirebaseToken` DROP COLUMN `batchId`,
    DROP COLUMN `userId`;

-- CreateIndex
CREATE UNIQUE INDEX `FirebaseToken_token_key` ON `FirebaseToken`(`token`);
