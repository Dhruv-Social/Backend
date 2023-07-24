import express, { Request, Response, Router } from "express";

import { prisma } from "../../core/prisma/prisma";
import { authToken } from "../../core/auth/auth";
import { Post } from "@prisma/client";

const forYouPosts: Router = express.Router();

/* 
  Endpoint to get a users data 
*/
forYouPosts.get("/", authToken, async (req: Request, res: Response) => {
  const { uuid } = req.user;
  const postsToReturn: Post[] = [];

  // Get their following and followers posts
  const followingAndFollowers = await prisma.user.findUnique({
    where: {
      uuid: uuid,
    },
    select: {
      following: true,
    },
  });

  //
  if (followingAndFollowers === null) {
    return res.send("You are bad");
  }

  // First we get their following posts
  for (let i = 0; i < followingAndFollowers.following.length; i++) {
    const tmp =
      (await prisma.post.findMany({
        where: {
          author_uuid: followingAndFollowers.following[i],
        },
      })) ?? [];

    postsToReturn.push(...tmp);
  }

  // Return the for you posts
  return res.send(postsToReturn);
});

export default forYouPosts;
