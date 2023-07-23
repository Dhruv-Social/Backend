// Express
import express, { Request, Response, Router } from "express";

// Local imports
import { prisma } from "../../core/prisma/prisma";
import { authToken } from "../../core/auth/auth";
import { Post } from "@prisma/client";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { GetErrors } from "../../core/errors/errors";

const fetchOtherPosts: Router = express.Router();

/* 
  Endpoint to get the user posts
*/
fetchOtherPosts.get("/", authToken, async (req: Request, res: Response) => {
  // Get data from the request
  const { uuid } = req.query;

  // If the post uuid is not a string, then we know the user entered some bogus binted data 👽
  if (typeof uuid !== "string") {
    return res
      .status(GetErrors.getUserDidNotProvideDetails().details.errorCode)
      .send(GetErrors.getUserDidNotProvideDetails());
  }

  // Verifying the data inputed from the user
  const arr = [uuid];
  if (!verifyArray(arr)) {
    return res
      .status(GetErrors.getUserDidNotProvideDetails().details.errorCode)
      .send(GetErrors.getUserDidNotProvideDetails());
  }

  // Get the posts
  const posts: Post[] = await prisma.post.findMany({
    where: {
      author_uuid: uuid,
    },
  });

  // Send back the posts
  return res.send(posts);
});

export default fetchOtherPosts;
