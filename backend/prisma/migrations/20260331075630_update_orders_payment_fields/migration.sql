/*
  Warnings:

  - Added the required column `payment_method` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `payment_method` VARCHAR(20) NOT NULL,
    ADD COLUMN `payment_status` VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `stripe_checkout_session_id` VARCHAR(255) NULL,
    ADD COLUMN `stripe_payment_intent_id` VARCHAR(255) NULL;
