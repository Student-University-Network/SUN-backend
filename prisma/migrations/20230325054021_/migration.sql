-- CreateTable
CREATE TABLE `AcademicDetails` (
    `userId` VARCHAR(191) NOT NULL,
    `rollNo` INTEGER NOT NULL,
    `batchId` VARCHAR(191) NOT NULL,
    `programId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `AcademicDetails_rollNo_key`(`rollNo`),
    INDEX `AcademicDetails_userId_idx`(`userId`),
    INDEX `AcademicDetails_batchId_idx`(`batchId`),
    INDEX `AcademicDetails_programId_idx`(`programId`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Batch` (
    `id` VARCHAR(191) NOT NULL,
    `batchName` VARCHAR(255) NOT NULL,
    `programId` VARCHAR(191) NULL,

    INDEX `Batch_programId_idx`(`programId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Program` (
    `id` VARCHAR(191) NOT NULL,
    `programName` VARCHAR(191) NOT NULL,
    `duration` INTEGER NOT NULL DEFAULT 0,
    `currentSemester` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Program_programName_key`(`programName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Semester` (
    `id` VARCHAR(191) NOT NULL,
    `semesterName` VARCHAR(255) NOT NULL,
    `order` INTEGER NOT NULL,
    `programId` VARCHAR(255) NOT NULL,

    INDEX `Semester_programId_idx`(`programId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `id` VARCHAR(191) NOT NULL,
    `courseName` VARCHAR(255) NOT NULL,
    `totalLectures` INTEGER NOT NULL DEFAULT 0,
    `semesterId` VARCHAR(255) NOT NULL,

    INDEX `Course_semesterId_idx`(`semesterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
