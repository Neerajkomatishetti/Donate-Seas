/*
  Warnings:

  - Changed the type of `amount` on the `Donation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "amount",
ADD COLUMN     "amount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userDonations" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "name" SET NOT NULL;
