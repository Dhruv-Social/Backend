/*
  Warnings:

  - Added the required column `author_profile_picture` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "author_profile_picture" TEXT NOT NULL;
