/*
  Warnings:

  - The required column `id` was added to the `FirebaseToken` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX `FirebaseToken_token_key` ON `FirebaseToken`;

-- AlterTable
ALTER TABLE `FirebaseToken` ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
