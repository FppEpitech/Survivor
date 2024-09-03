/*
  Warnings:

  - Added the required column `old_id` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `old_id` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `old_id` to the `Encounter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `old_id` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `old_id` to the `Tip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "old_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "old_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Encounter" ADD COLUMN     "old_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "old_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Tip" ADD COLUMN     "old_id" INTEGER NOT NULL;
