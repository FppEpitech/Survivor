/*
  Warnings:

  - Added the required column `address` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT NOT NULL;
