/*
  Warnings:

  - You are about to drop the column `Status` on the `Donation` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "Status",
ADD COLUMN     "status" "DonationStatus" NOT NULL DEFAULT 'PENDING';
