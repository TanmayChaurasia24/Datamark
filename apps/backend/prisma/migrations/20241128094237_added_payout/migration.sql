/*
  Warnings:

  - Changed the type of `amount` on the `Submissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "txnstatus" AS ENUM ('processing', 'Success', 'Failure');

-- AlterTable
ALTER TABLE "Submissions" DROP COLUMN "amount",
ADD COLUMN     "amount" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Payouts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "signature" TEXT NOT NULL,
    "status" "txnstatus" NOT NULL,

    CONSTRAINT "Payouts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payouts" ADD CONSTRAINT "Payouts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
