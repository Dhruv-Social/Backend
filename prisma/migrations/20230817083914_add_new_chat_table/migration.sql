/*
  Warnings:

  - Added the required column `publicKey` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "publicKey" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Chat" (
    "chatUuid" TEXT NOT NULL,
    "users" JSONB[],
    "messages" JSONB[],

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("chatUuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chat_chatUuid_key" ON "Chat"("chatUuid");
