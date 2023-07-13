import express, { Request, Response, Router } from "express";

import { prisma } from "../../core/prisma/prisma";
import { authToken } from "../../core/auth/auth";
import { Post } from "@prisma/client";

const fetchUsersPosts: Router = express.Router();

// Endpoint to get the user posts
fetchUsersPosts.get(
  "/",
  authToken,
  async (req: Request | any, res: Response) => {
    const { uuid } = req.user;

    let posts: Post[] = await prisma.post.findMany({
      where: {
        author_uuid: uuid,
      },
    });

    return res.send(posts);
  }
);

export default fetchUsersPosts;
