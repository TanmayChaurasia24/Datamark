/*
  Warnings:

  - You are about to drop the column `options_id` on the `Option` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Option" DROP COLUMN "options_id";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "title" DROP NOT NULL;
