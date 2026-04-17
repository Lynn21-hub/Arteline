CREATE TABLE `artist_profiles` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `creator_sub` VARCHAR(191) NOT NULL,
  `display_name` VARCHAR(255) NOT NULL,
  `bio` TEXT NOT NULL,
  `avatar_url` TEXT NULL,
  `location` VARCHAR(255) NULL,
  `website` VARCHAR(255) NULL,
  `instagram` VARCHAR(255) NULL,
  `is_published` BOOLEAN NOT NULL DEFAULT true,
  `is_featured` BOOLEAN NOT NULL DEFAULT false,
  `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

  UNIQUE INDEX `artist_profiles_creator_sub_key`(`creator_sub`),
  INDEX `artist_profiles_is_published_idx`(`is_published`),
  INDEX `artist_profiles_is_featured_idx`(`is_featured`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
