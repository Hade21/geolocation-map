/*
  Warnings:

  - You are about to drop the column `profilePic` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "profilePic",
ADD COLUMN     "profilePict" TEXT;
