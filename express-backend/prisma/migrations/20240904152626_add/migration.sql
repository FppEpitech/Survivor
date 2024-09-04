/*
  Warnings:

  - You are about to drop the `CustomerClothe` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clothes` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CustomerClothe" DROP CONSTRAINT "CustomerClothe_customerId_fkey";

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "clothes" JSONB NOT NULL;

-- DropTable
DROP TABLE "CustomerClothe";
