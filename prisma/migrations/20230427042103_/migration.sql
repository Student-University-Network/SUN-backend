-- CreateTable
CREATE TABLE `Announcement` (
    `announcementId` VARCHAR(255) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `programId` VARCHAR(191) NULL,

    INDEX `Announcement_userId_idx`(`userId`),
    INDEX `Announcement_programId_idx`(`programId`),
    PRIMARY KEY (`announcementId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
