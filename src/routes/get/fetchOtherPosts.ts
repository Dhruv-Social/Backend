import express, { Request, Response, Router } from "express";

import { prisma } from "../../core/prisma/prisma";
import { authToken } from "../../core/auth/auth";
import { Post } from "@prisma/client";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { GetErrors } from "../../core/errors/errors";

const fetchOtherPosts: Router = express.Router();

// Endpoint to get the user posts
fetchOtherPosts.get("/", authToken, async (req: Request, res: Response) => {
  const { uuid } = req.query;

  if (typeof uuid !== "string") {
    return res
      .status(GetErrors.getUserDidNotProvideDetails().details.errorCode)
      .send(GetErrors.getUserDidNotProvideDetails());
  }

  const arr = [uuid];

  if (!verifyArray(arr)) {
    return res
      .status(GetErrors.getUserDidNotProvideDetails().details.errorCode)
      .send(GetErrors.getUserDidNotProvideDetails());
  }

  const posts: Post[] = await prisma.post.findMany({
    where: {
      author_uuid: uuid,
    },
  });

  return res.send(posts);
});

export default fetchOtherPosts;
