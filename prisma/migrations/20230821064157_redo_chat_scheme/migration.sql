/*
  Warnings:

  - Added the required column `message` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "message" TEXT NOT NULL;
