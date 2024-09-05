/*
  Warnings:

  - Added the required column `customer_id` to the `PaymentHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentHistory" ADD COLUMN     "customer_id" INTEGER NOT NULL;
