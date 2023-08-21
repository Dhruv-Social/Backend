/*
  Warnings:

  - The primary key for the `Chat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `chatUuid` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `users` on the `Chat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chat_uuid]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chat_uuid` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_one` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_two` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Chat_chatUuid_key";

-- AlterTable
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_pkey",
DROP COLUMN "chatUuid",
DROP COLUMN "users",
ADD COLUMN     "chat_uuid" TEXT NOT NULL,
ADD COLUMN     "user_one" TEXT NOT NULL,
ADD COLUMN     "user_two" TEXT NOT NULL,
ADD CONSTRAINT "Chat_pkey" PRIMARY KEY ("chat_uuid");

-- CreateTable
CREATE TABLE "Message" (
    "message_uuid" TEXT NOT NULL,
    "chat_relation" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "creattiom_time" BIGINT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("message_uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Message_message_uuid_key" ON "Message"("message_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_chat_uuid_key" ON "Chat"("chat_uuid");
