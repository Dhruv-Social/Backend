import express, { Request, Response, Router } from "express";

import { prisma } from "../../core/prisma/prisma";
import { DeleteErrors } from "../../core/errors/errors";
import { verifyArray } from "../../core/verifyArray/verifyArray";

const deletePost: Router = express.Router();

deletePost.delete("/", async (req: Request, res: Response) => {
  const { uuid } = req.body;

  let arr: string[] = [uuid];

  if (!verifyArray(arr)) {
    return res
      .status(DeleteErrors.didNotProvideDetails().details.errorCode)
      .send(DeleteErrors.didNotProvideDetails());
  }

  const prismaRes = await prisma.post.findUnique({
    where: {
      post_uuid: uuid,
    },
  });

  if (prismaRes === null) {
    return res
      .status(DeleteErrors.deletePostPostDoesNotExist().details.errorCode)
      .send(DeleteErrors.deletePostPostDoesNotExist());
  }

  await prisma.post.delete({
    where: {
      post_uuid: uuid,
    },
  });

  return res.send("success");
});

export default deletePost;
