/*
  Warnings:

  - Added the required column `coach_id` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "coach_id" INTEGER NOT NULL;
