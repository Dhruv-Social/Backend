import express, { Request, Response, Router } from "express";

import { authToken } from "../../core/auth/auth";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { PutErrors } from "../../core/errors/errors";
import { prisma } from "../../core/prisma/prisma";
import { GetErrors } from "../../core/errors/errors";

const likePost: Router = express.Router();

likePost.put("/", authToken, async (req: Request, res: Response) => {
  const { uuid } = req.user;
  const { postUuid } = req.query;

  if (typeof postUuid !== "string") {
    return res
      .status(GetErrors.getUserDidNotProvideDetails().details.errorCode)
      .send(GetErrors.getUserDidNotProvideDetails());
  }

  const arr = [postUuid];

  if (!verifyArray(arr))
    return res
      .status(PutErrors.didNotProvideDetails().details.errorCode)
      .send(PutErrors.didNotProvideDetails());

  const currentLikes = await prisma.post.findUnique({
    where: {
      post_uuid: postUuid,
    },
    select: {
      likes: true,
    },
  });

  if (currentLikes === null) {
    return res.send("This post does not exist");
  }

  if (currentLikes.likes.includes(uuid)) {
    return res.send("You can not like a post you've already liked");
  }

  await prisma.post.update({
    where: {
      post_uuid: postUuid,
    },
    data: {
      likes: {
        push: uuid,
      },
    },
  });

  return res.send({ success: true });
});

export default likePost;
