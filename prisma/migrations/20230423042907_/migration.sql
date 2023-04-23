-- CreateTable
CREATE TABLE `Attendance` (
    `userId` VARCHAR(255) NOT NULL,
    `courseId` VARCHAR(255) NOT NULL,
    `attended` INTEGER NOT NULL DEFAULT 0,
    `lectureId` VARCHAR(191) NOT NULL,

    INDEX `Attendance_userId_idx`(`userId`),
    INDEX `Attendance_courseId_idx`(`courseId`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
