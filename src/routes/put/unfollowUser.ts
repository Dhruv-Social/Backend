import express, { Request, Response, Router } from "express";

import { authToken } from "../../core/auth/auth";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { PutErrors } from "../../core/errors/errors";
import { prisma } from "../../core/prisma/prisma";

const unfollowUser: Router = express.Router();

unfollowUser.put("/", authToken, async (req: Request | any, res: Response) => {
  const { uuid } = req.user;
  const { uuidToUnfollow } = req.query;

  const arr: string[] = [uuid, uuidToUnfollow];

  // Verify that the user provided the right data
  if (!verifyArray(arr)) {
    return res
      .status(PutErrors.didNotProvideDetails().details.errorCode)
      .send(PutErrors.didNotProvideDetails());
  }

  // Get the users following
  const usersFollowing = await prisma.user.findUnique({
    where: {
      uuid: uuidToUnfollow,
    },
    select: {
      followers: true,
    },
  });

  const usersIAmFollwing = await prisma.user.findUnique({
    where: {
      uuid: uuid,
    },
    select: {
      following: true,
    },
  });

  // If the data is null, then we know the user does not exist
  if (usersFollowing === null) {
    return res
      .status(PutErrors.followUserIncorrectUuid().details.errorCode)
      .send(PutErrors.followUserIncorrectUuid());
  }

  // If the user is not in the users following list, then we know that they do not follow then, then we send them an error
  if (!usersFollowing?.followers.includes(uuid)) {
    return res
      .status(PutErrors.unfollowUserYouDontFollow().details.errorCode)
      .send(PutErrors.unfollowUserYouDontFollow());
  }

  // Else we just remove them from the following list
  await prisma.user.update({
    data: {
      followers: {
        set: usersFollowing.followers.filter((id) => id !== uuid),
      },
    },
    where: {
      uuid: uuidToUnfollow,
    },
  });

  // Remove the followed user from the following list
  await prisma.user.update({
    data: {
      following: {
        set: usersIAmFollwing?.following.filter((id) => id !== uuidToUnfollow),
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

export default unfollowUser;
