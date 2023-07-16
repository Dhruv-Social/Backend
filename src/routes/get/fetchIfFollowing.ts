import express, { Request, Response, Router } from "express";

import { authToken } from "../../core/auth/auth";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { GetErrors } from "../../core/errors/errors";
import { prisma } from "../../core/prisma/prisma";

const fetchIfFollowing: Router = express.Router();

// Endpoint to get another user
fetchIfFollowing.get(
  "/",
  authToken,
  async (req: Request | any, res: Response) => {
    const { ifFollowingUuid } = req.query;
    const { uuid } = req.user;

    const arr: string[] = [uuid];

    // Verifying the data inputed from the user
    if (!verifyArray(arr)) {
      return res
        .status(GetErrors.getUserDidNotProvideDetails().details.errorCode)
        .send(GetErrors.getUserDidNotProvideDetails());
    }

    // Get the following list of the user we are checking
    const followingArr = await prisma.user.findUnique({
      where: {
        uuid: ifFollowingUuid,
      },
      select: {
        followers: true,
      },
    });

    if (followingArr === null) {
      return res.status(400).send({ detail: "This user does not exist" });
    }

    const isFollowing = followingArr.followers.includes(uuid);

    if (!isFollowing) {
      return res.send({ detail: false });
    }

    return res.send({ detail: true });
  }
);

export default fetchIfFollowing;
