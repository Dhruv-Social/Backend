// Express
import express, { Request, Response, Router } from "express";

// Local imports
import { prisma } from "../../core/prisma/prisma";
import { authToken } from "../../core/auth/auth";
import { IFollowingData } from "../../core/data/interfaces";

const fetchUserFollowing: Router = express.Router();

/*
  Endpoint to get a users own data
*/
fetchUserFollowing.get("/", authToken, async (req: Request, res: Response) => {
  const { uuid } = req.user;

  const userFollowing = await prisma.user.findUnique({
    where: {
      uuid: uuid,
    },
    select: {
      following: true,
    },
  });

  if (userFollowing === null) {
    return res.send();
  }

  const arrOfFollowingData: IFollowingData[] = [];

  for (let i = 0; i < userFollowing.following.length; i++) {
    const prismaReturn = await prisma.user.findUnique({
      where: {
        uuid: userFollowing.following[i],
      },
      select: {
        uuid: true,
        username: true,
        display_name: true,
        profilePicture: true,
        banner: true,
      },
    });

    if (prismaReturn === null) {
      return;
    }

    arrOfFollowingData.push(prismaReturn);
  }

  return res.send(arrOfFollowingData);
});

export default fetchUserFollowing;
