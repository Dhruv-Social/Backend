/*
  Warnings:

  - Added the required column `banner` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePicure` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "banner" TEXT NOT NULL,
ADD COLUMN     "profilePicure" TEXT NOT NULL;
