import express, { Request, Response, Router } from "express";

import { authToken } from "../../core/auth/auth";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { PutErrors } from "../../core/errors/errors";
import { prisma } from "../../core/prisma/prisma";

const likePost: Router = express.Router();

likePost.put("/", authToken, async (req: Request | any, res: Response) => {
  const { uuid } = req.user;
  const { postUuid } = req.query;

  const arr = [postUuid];

  if (!verifyArray(arr))
    return res
      .status(PutErrors.didNotProvideDetails().details.errorCode)
      .send(PutErrors.didNotProvideDetails());

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

  res.send("success!");
});

export default likePost;
