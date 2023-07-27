// Express
import express, { Request, Response, Router } from "express";

// Local Imports
import { prisma } from "../../core/prisma/prisma";
import { DeleteErrors } from "../../core/errors/deleteErrors";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { authToken } from "../../core/auth/auth";

const deletePost: Router = express.Router();

/* 
  Endpoint to delete a post from a user
*/
deletePost.delete("/", authToken, async (req: Request, res: Response) => {
  // post uuid from the request body
  const { postUuid } = req.body;
  const { uuid } = req.user;

  const arr: string[] = [postUuid];

  // Loop over all the items in the array
  if (!verifyArray(arr)) {
    return res
      .status(DeleteErrors.didNotProvideDetails().details.errorCode)
      .send(DeleteErrors.didNotProvideDetails());
  }

  // Fetch the post
  const prismaRes = await prisma.post.findUnique({
    where: {
      post_uuid: postUuid,
    },
    select: {
      author_uuid: true,
    },
  });

  // If the post is null, then we know it does not exist
  if (prismaRes === null) {
    return res
      .status(DeleteErrors.deletePostPostDoesNotExist().details.errorCode)
      .send(DeleteErrors.deletePostPostDoesNotExist());
  }

  // If the uuid of the author post is not equal to the requet token uuid, then we know that the user is trying to delete a post that does not belong to them.
  if (uuid !== prismaRes.author_uuid) {
    return res
      .status(DeleteErrors.deleteYouCanNotDeleteAnotherPost().details.errorCode)
      .send(DeleteErrors.deleteYouCanNotDeleteAnotherPost());
  }

  // Delete the post
  await prisma.post.delete({
    where: {
      post_uuid: postUuid,
    },
  });

  // Return Success
  return res.send("success");
});

export default deletePost;
