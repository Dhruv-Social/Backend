/*
  Warnings:

  - You are about to drop the column `messages` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `creattiom_time` on the `Message` table. All the data in the column will be lost.
  - Added the required column `creatiom_time` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "messages";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "creattiom_time",
ADD COLUMN     "creatiom_time" BIGINT NOT NULL;
