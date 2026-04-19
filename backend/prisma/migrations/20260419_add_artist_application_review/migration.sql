ALTER TABLE `artist_profiles`
  ADD COLUMN `applicant_email` VARCHAR(255) NULL,
  ADD COLUMN `application_status` VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  ADD COLUMN `reviewed_at` TIMESTAMP NULL,
  ADD COLUMN `reviewed_by` VARCHAR(191) NULL,
  ADD COLUMN `rejection_reason` TEXT NULL;

CREATE INDEX `artist_profiles_application_status_idx` ON `artist_profiles`(`application_status`);

UPDATE `artist_profiles`
SET `application_status` = 'APPROVED'
WHERE `display_name` IS NOT NULL
  AND TRIM(`display_name`) <> ''
  AND `bio` IS NOT NULL
  AND TRIM(`bio`) <> '';
