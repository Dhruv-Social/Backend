import express, { Request, Response, Router } from "express";

import { authToken } from "../../core/auth/auth";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { PutErrors } from "../../core/errors/putErrors";
import { prisma } from "../../core/prisma/prisma";

const likePost: Router = express.Router();

likePost.put("/", authToken, async (req: Request, res: Response) => {
  const { uuid } = req.user;
  const { postUuid } = req.query;

  if (typeof postUuid !== "string") {
    return res
      .status(PutErrors.anItemIsNotAString().details.errorCode)
      .send(PutErrors.anItemIsNotAString());
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
    return res
      .status(PutErrors.canNotLikeAPostThatDoesNotExist().details.errorCode)
      .send(PutErrors.canNotLikeAPostThatDoesNotExist());
  }

  if (currentLikes.likes.includes(uuid)) {
    return res
      .status(PutErrors.youveAlreadyLikedThisPost().details.errorCode)
      .send(PutErrors.youveAlreadyLikedThisPost());
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
