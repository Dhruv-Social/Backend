import express, { Request, Response, Router } from "express";
import crypto from "crypto";

import { authToken } from "../../core/auth/auth";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { PutErrors } from "../../core/errors/errors";
import { prisma } from "../../core/prisma/prisma";
import { IPostComment } from "../../core/data/interfaces";
import { GetErrors } from "../../core/errors/errors";

const commentOnPost: Router = express.Router();

// Endpoint to create a comment on a post
commentOnPost.put("/", authToken, async (req: Request, res: Response) => {
  const { uuid } = req.user;
  const { postUuid } = req.query;
  const { commentText } = req.body;

  if (typeof postUuid !== "string") {
    return res
      .status(GetErrors.getUserDidNotProvideDetails().details.errorCode)
      .send(GetErrors.getUserDidNotProvideDetails());
  }

  const arr = [commentText, postUuid];

  if (!verifyArray(arr))
    return res
      .status(PutErrors.didNotProvideDetails().details.errorCode)
      .send(PutErrors.didNotProvideDetails());

  const commentData: IPostComment = {
    commentUuid: crypto.randomUUID(),
    authorUuid: uuid,
    text: commentText,
    likes: 0,
  };

  await prisma.post.update({
    where: {
      post_uuid: postUuid,
    },
    data: {
      comments: {
        push: commentData as any,
      },
    },
  });

  return res.send("success!");
});

export default commentOnPost;
