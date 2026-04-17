CREATE TABLE `artist_payouts` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `artist_sub` VARCHAR(191) NOT NULL,
  `order_item_id` INTEGER NOT NULL,
  `gross_amount` DECIMAL(10, 2) NOT NULL,
  `platform_fee` DECIMAL(10, 2) NOT NULL,
  `artist_amount` DECIMAL(10, 2) NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  `payment_reference` VARCHAR(255) NULL,
  `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `paid_at` TIMESTAMP(0) NULL,

  INDEX `artist_payouts_artist_sub_idx`(`artist_sub`),
  INDEX `artist_payouts_status_idx`(`status`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `artist_payouts`
  ADD CONSTRAINT `artist_payouts_order_item_id_fkey`
  FOREIGN KEY (`order_item_id`) REFERENCES `order_items`(`id`)
  ON DELETE RESTRICT ON UPDATE CASCADE;
