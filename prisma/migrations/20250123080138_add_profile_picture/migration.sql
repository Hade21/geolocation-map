/*
  Warnings:

  - Added the required column `profilePic` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "profilePic" VARCHAR(100) NOT NULL;
