import express, { Request, Response, Router } from "express";

import { prisma } from "../../core/prisma/prisma";
import { authToken } from "../../core/auth/auth";
import { IFollowerData } from "../../core/data/interfaces";

const fetchUserFollowers: Router = express.Router();

// Endpoint to get a users own data
fetchUserFollowers.get(
  "/",
  authToken,
  async (req: Request | any, res: Response) => {
    const { uuid } = req.user;

    const userFollowers = await prisma.user.findUnique({
      where: {
        uuid: uuid,
      },
      select: {
        followers: true,
      },
    });

    if (userFollowers === null) {
      return res.send();
    }

    let arrOfFollowerData: IFollowerData[] = [];

    for (let i = 0; i < userFollowers.followers.length; i++) {
      const prismaReturn = await prisma.user.findUnique({
        where: {
          uuid: userFollowers.followers[i],
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

      arrOfFollowerData.push(prismaReturn);
    }

    return res.send(arrOfFollowerData);
  }
);

export default fetchUserFollowers;
