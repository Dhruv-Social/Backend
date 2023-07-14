/*
  Warnings:

  - Added the required column `author_display_name` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_username` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "author_display_name" TEXT NOT NULL,
ADD COLUMN     "author_username" TEXT NOT NULL;
