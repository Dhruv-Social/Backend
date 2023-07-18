import express, { Request, Response, Router } from "express";

import { authToken } from "../../core/auth/auth";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { PutErrors } from "../../core/errors/errors";
import { prisma } from "../../core/prisma/prisma";
import { GetErrors } from "../../core/errors/errors";

const unLikePost: Router = express.Router();

unLikePost.put("/", authToken, async (req: Request, res: Response) => {
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

  // Get the current likes
  const likesOnPost = await prisma.post.findUnique({
    where: {
      post_uuid: postUuid,
    },
    select: {
      likes: true,
    },
  });

  if (likesOnPost === null) {
    return res.send({ detail: "This item does not exist" });
  }

  if (!likesOnPost.likes.includes(uuid)) {
    return res.send({ detail: "You can not unlike a post you havent liked" });
  }

  const filteredLikesList = likesOnPost.likes.filter(
    (likeUuid) => likeUuid !== uuid
  );

  await prisma.post.update({
    where: {
      post_uuid: postUuid,
    },
    data: {
      likes: {
        set: filteredLikesList,
      },
    },
  });

  return res.send({ success: true });
});

export default unLikePost;
