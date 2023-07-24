// Express
import express, { Request, Response, Router } from "express";

// Local Imports
import { authToken } from "../../core/auth/auth";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { GetErrors } from "core/errors/getErrors";
import { prisma } from "../../core/prisma/prisma";

const fetchIfPostLiked: Router = express.Router();

/* 
  Endpoint to fetch if I have liked a post
*/
fetchIfPostLiked.get("/", authToken, async (req: Request, res: Response) => {
  // Getting data from the request
  const { uuid } = req.user;
  const { postUuid } = req.query;

  // If the post uuid is not a string, then we know the user entered some bogus binted data 👽
  if (typeof postUuid !== "string") {
    return res
      .status(GetErrors.anItemIsNotAString().details.errorCode)
      .send(GetErrors.anItemIsNotAString());
  }

  const arr: string[] = [postUuid];

  // Verifying the data inputed from the user
  if (!verifyArray(arr)) {
    return res
      .status(GetErrors.getUserDidNotProvideDetails().details.errorCode)
      .send(GetErrors.getUserDidNotProvideDetails());
  }

  // Get the following list of the user we are checking
  const postLikes = await prisma.post.findUnique({
    where: {
      post_uuid: postUuid,
    },
    select: {
      likes: true,
    },
  });

  // If the postgres data return is null, then it does not exist
  if (postLikes === null) {
    return res
      .status(GetErrors.postDoesNotExist().details.errorCode)
      .send(GetErrors.postDoesNotExist());
  }

  // If is liked is false, then we know that we have not liked that post
  const isLiked = postLikes.likes.includes(uuid);
  if (!isLiked) {
    return res.send({ detail: false });
  }

  // Return success
  return res.send({ success: true });
});

export default fetchIfPostLiked;
