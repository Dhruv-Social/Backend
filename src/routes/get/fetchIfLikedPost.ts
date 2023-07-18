import express, { Request, Response, Router } from "express";

import { authToken } from "../../core/auth/auth";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { GetErrors } from "../../core/errors/errors";
import { prisma } from "../../core/prisma/prisma";

const fetchIfPostLiked: Router = express.Router();

// Endpoint to get another user
fetchIfPostLiked.get("/", authToken, async (req: Request, res: Response) => {
  const { uuid } = req.user;
  const { postUuid } = req.query;

  if (typeof postUuid !== "string") {
    return res.send("e");
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

  if (postLikes === null) {
    return res
      .status(400)
      .send({ detail: "The post you requested does not exist" });
  }

  if (postLikes === null) {
    return res.status(400).send({ detail: "This user does not exist" });
  }

  const isFollowing = postLikes.likes.includes(uuid);

  if (!isFollowing) {
    return res.send({ detail: false });
  }

  return res.send({ success: true });
});

export default fetchIfPostLiked;
