import express, { Request, Response, Router } from "express";

import { authToken } from "../../core/auth/auth";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { GetErrors } from "../../core/errors/errors";
import { prisma } from "../../core/prisma/prisma";

const fetchOther: Router = express.Router();

// Endpoint to get another user
fetchOther.get("/", authToken, async (req: Request, res: Response) => {
  const { uuid } = req.query;

  if (typeof uuid !== "string") {
    return res
      .status(GetErrors.getUserDidNotProvideDetails().details.errorCode)
      .send(GetErrors.getUserDidNotProvideDetails());
  }

  const arr: string[] = [uuid];

  // Verifying the data inputed from the user
  if (!verifyArray(arr)) {
    return res
      .status(GetErrors.getUserDidNotProvideDetails().details.errorCode)
      .send(GetErrors.getUserDidNotProvideDetails());
  }

  const userData = await prisma.user.findUnique({
    where: {
      uuid: uuid,
    },
    select: {
      username: true,
      display_name: true,
      description: true,
      location: true,
      followers: true,
      following: true,
      posts: true,
      profilePicture: true,
      banner: true,
    },
  });

  // If the data is null, then we return an error via the Error class
  if (userData === null) {
    return res
      .status(GetErrors.getUserDoesNotExist().details.errorCode)
      .send(GetErrors.getUserDoesNotExist());
  }

  return res.send(userData);
});

export default fetchOther;
