/*
  Warnings:

  - Added required shipping columns to `orders`. This migration assumes the table is currently empty or that
    you will backfill any existing rows before enforcing non-null values in production.

*/

ALTER TABLE `orders`
    ADD COLUMN `customer_name` VARCHAR(255) NULL,
    ADD COLUMN `phone_number` VARCHAR(50) NULL,
    ADD COLUMN `shipping_address_line1` VARCHAR(255) NULL,
    ADD COLUMN `shipping_address_line2` VARCHAR(255) NULL,
    ADD COLUMN `shipping_city` VARCHAR(100) NULL,
    ADD COLUMN `shipping_postal_code` VARCHAR(30) NULL,
    ADD COLUMN `shipping_country` VARCHAR(100) NULL;

UPDATE `orders`
SET
    `customer_name` = COALESCE(`customer_name`, 'Unknown Customer'),
    `phone_number` = COALESCE(`phone_number`, 'N/A'),
    `shipping_address_line1` = COALESCE(`shipping_address_line1`, 'Not provided'),
    `shipping_city` = COALESCE(`shipping_city`, 'Unknown City'),
    `shipping_postal_code` = COALESCE(`shipping_postal_code`, 'N/A'),
    `shipping_country` = COALESCE(`shipping_country`, 'Unknown Country')
WHERE
    `customer_name` IS NULL
    OR `phone_number` IS NULL
    OR `shipping_address_line1` IS NULL
    OR `shipping_city` IS NULL
    OR `shipping_postal_code` IS NULL
    OR `shipping_country` IS NULL;

ALTER TABLE `orders`
    MODIFY `customer_name` VARCHAR(255) NOT NULL,
    MODIFY `phone_number` VARCHAR(50) NOT NULL,
    MODIFY `shipping_address_line1` VARCHAR(255) NOT NULL,
    MODIFY `shipping_address_line2` VARCHAR(255) NULL,
    MODIFY `shipping_city` VARCHAR(100) NOT NULL,
    MODIFY `shipping_postal_code` VARCHAR(30) NOT NULL,
    MODIFY `shipping_country` VARCHAR(100) NOT NULL;
