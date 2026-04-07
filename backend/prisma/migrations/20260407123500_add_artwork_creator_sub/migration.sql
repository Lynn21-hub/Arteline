-- AlterTable
ALTER TABLE `artworks`
  ADD COLUMN `creator_sub` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `artworks_creator_sub_idx` ON `artworks`(`creator_sub`);
