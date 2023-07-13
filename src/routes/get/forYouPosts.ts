import express, { Request, Response, Router } from "express";

import { prisma } from "../../core/prisma/prisma";
import { authToken } from "../../core/auth/auth";
import { Post } from "@prisma/client";

const forYouPosts: Router = express.Router();

// Endpoint to get a users data
forYouPosts.get("/", authToken, async (req: Request | any, res: Response) => {
  const { uuid } = req.user;
  let postsToReturn: Post[] = [];

  // Get their following and followers posts
  const followingAndFollowers = await prisma.user.findUnique({
    where: {
      uuid: uuid,
    },
    select: {
      following: true,
      followers: true,
    },
  });

  // First we get their following posts
  followingAndFollowers?.following.forEach(async (followerUuid: string) => {
    const tmp =
      (await prisma.post.findMany({
        where: {
          author_uuid: followerUuid,
        },
      })) ?? [];

    postsToReturn.push(...tmp);
  });

  // Second we get their followers posts
  followingAndFollowers?.followers.forEach(async (followerUuid: string) => {
    const tmp =
      (await prisma.post.findMany({
        where: {
          author_uuid: followerUuid,
        },
      })) ?? [];

    postsToReturn.push(...tmp);
  });

  // once they've seen all their important posts then we show them other posts
  (await prisma.post.findMany({ take: 20 })).forEach((post) => [
    postsToReturn.push(post),
  ]);

  return res.send(postsToReturn);
});

export default forYouPosts;
