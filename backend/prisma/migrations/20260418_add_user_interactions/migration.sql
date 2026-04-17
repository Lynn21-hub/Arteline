-- CreateTable user_interactions
CREATE TABLE `user_interactions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(191) NOT NULL,
  `artwork_id` INT NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_interactions_user_id_artwork_id_type_key`(`user_id`, `artwork_id`, `type`),
  KEY `user_interactions_user_id_idx`(`user_id`),
  KEY `user_interactions_artwork_id_idx`(`artwork_id`),
  KEY `user_interactions_type_idx`(`type`),
  CONSTRAINT `user_interactions_artwork_id_fkey` FOREIGN KEY (`artwork_id`) REFERENCES `artworks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
