// Express
import express, { Request, Response, Router } from "express";

// Local Imports
import { authToken } from "../../core/auth/auth";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { GetErrors } from "../../core/errors/errors";
import { prisma } from "../../core/prisma/prisma";

const fetchIfFollowing: Router = express.Router();

/* 
  This endpoint is to check if a user is following another
*/
fetchIfFollowing.get("/", authToken, async (req: Request, res: Response) => {
  const { ifFollowingUuid } = req.query;
  const { uuid } = req.user;

  // If the type of the query parameter is not string, then we know what they provided was null
  if (typeof ifFollowingUuid !== "string") {
    return res.send("e");
  }

  // Set an array of items to check
  const arr: string[] = [ifFollowingUuid];

  // Verifying the data inputted from the user
  if (!verifyArray(arr)) {
    return res
      .status(GetErrors.getUserDidNotProvideDetails().details.errorCode)
      .send(GetErrors.getUserDidNotProvideDetails());
  }

  // Get the list of all the followers
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
});

export default fetchIfFollowing;
