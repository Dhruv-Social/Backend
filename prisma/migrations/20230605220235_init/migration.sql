-- CreateTable
CREATE TABLE "User" (
    "uuid" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phonenumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "followers" JSONB[],
    "following" JSONB[],
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "posts" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Post" (
    "post_uuid" TEXT NOT NULL,
    "author_uuid" TEXT NOT NULL,
    "likes" JSONB[],
    "comments" JSONB[],

    CONSTRAINT "Post_pkey" PRIMARY KEY ("post_uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Post_post_uuid_key" ON "Post"("post_uuid");
