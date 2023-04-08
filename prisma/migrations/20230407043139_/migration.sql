-- CreateTable
CREATE TABLE `Timetable` (
    `timetableId` VARCHAR(255) NOT NULL,
    `timetableCsv` VARCHAR(191) NOT NULL,
    `batchId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Timetable_batchId_key`(`batchId`),
    PRIMARY KEY (`timetableId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
