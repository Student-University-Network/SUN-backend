-- CreateTable
CREATE TABLE `TeachersOnCourse` (
    `courseId` VARCHAR(191) NOT NULL,
    `professorId` VARCHAR(255) NOT NULL,
    `batchId` VARCHAR(191) NOT NULL,

    INDEX `TeachersOnCourse_courseId_idx`(`courseId`),
    INDEX `TeachersOnCourse_professorId_idx`(`professorId`),
    INDEX `TeachersOnCourse_batchId_idx`(`batchId`),
    PRIMARY KEY (`courseId`, `batchId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
