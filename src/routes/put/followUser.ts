import express, { Request, Response, Router } from "express";

import { authToken } from "../../core/auth/auth";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { PutErrors } from "../../core/errors/putErrors";
import { prisma } from "../../core/prisma/prisma";

const followUser: Router = express.Router();

// Endpoint to follow a user
followUser.put("/", authToken, async (req: Request, res: Response) => {
  const { uuid } = req.user;
  const { uuidToFollow } = req.query;

  if (typeof uuidToFollow !== "string") {
    return res
      .status(PutErrors.anItemIsNotAString().details.errorCode)
      .send(PutErrors.anItemIsNotAString());
  }

  const arr: string[] = [uuid, uuidToFollow];

  // Verify that the user provided the right data
  if (!verifyArray(arr)) {
    return res
      .status(PutErrors.didNotProvideDetails().details.errorCode)
      .send(PutErrors.didNotProvideDetails());
  }

  // Get the users following
  const usersFollowing = await prisma.user.findUnique({
    where: {
      uuid: uuidToFollow,
    },
    select: {
      followers: true,
    },
  });

  // If the data is null, then we know the user does not exist
  if (usersFollowing === null) {
    return res
      .status(PutErrors.followUserIncorrectUuid().details.errorCode)
      .send(PutErrors.followUserIncorrectUuid());
  }

  // If the user sending the request to follow is already in that list, then we know we already follow them
  if (usersFollowing?.followers.includes(uuid)) {
    return res
      .status(PutErrors.followUserYouAlreadyFollow().details.errorCode)
      .send(PutErrors.followUserYouAlreadyFollow());
  }

  // Else we just add them to the following list
  await prisma.user.update({
    data: {
      followers: {
        push: uuid,
      },
    },
    where: {
      uuid: uuidToFollow,
    },
  });

  // Add the followed user to the following list
  await prisma.user.update({
    data: {
      following: {
        push: uuidToFollow,
      },
    },
    where: {
      uuid: uuid,
    },
  });

  return res.json({
    success: true,
  });
});

export default followUser;
