import express, { Request, Response, Router } from "express";

import { prisma } from "../../core/prisma/prisma";
import { authToken } from "../../core/auth/auth";
import { Post } from "@prisma/client";

const fetchUsersPosts: Router = express.Router();

/* 
  Endpoint to get self's posts
*/
fetchUsersPosts.get("/", authToken, async (req: Request, res: Response) => {
  const { uuid } = req.user;

  const posts: Post[] = await prisma.post.findMany({
    where: {
      author_uuid: uuid,
    },
  });

  return res.send(posts);
});

export default fetchUsersPosts;
