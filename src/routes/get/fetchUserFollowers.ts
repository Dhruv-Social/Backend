// Express
import express, { Request, Response, Router } from "express";

// Local imports
import { prisma } from "../../core/prisma/prisma";
import { authToken } from "../../core/auth/auth";
import { IFollowerData } from "../../core/data/interfaces";
import { GetErrors } from "../../core/errors/getErrors";

const fetchUserFollowers: Router = express.Router();

/*
  Endpoint to fetch a users followers
*/
fetchUserFollowers.get("/", authToken, async (req: Request, res: Response) => {
  // Get the uuid from the requet token
  const { uuid } = req.user;

  // Get the users followers
  const userFollowers = await prisma.user.findUnique({
    where: {
      uuid: uuid,
    },
    select: {
      followers: true,
    },
  });

  // If the users following is null, then we know the user does not exist
  if (userFollowers === null) {
    return res
      .status(GetErrors.userDoesNotExist().details.errorCode)
      .send(GetErrors.userDoesNotExist());
  }

  // Instantiate array with set type
  const arrOfFollowerData: IFollowerData[] = [];

  // Loop over all the items, and add it to the array
  for (let i = 0; i < userFollowers.followers.length; i++) {
    // Get all the followers of a user
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

    // If the return user is null, then we know that user does not exist
    if (prismaReturn === null) {
      return res
        .status(GetErrors.userDoesNotExist().details.errorCode)
        .send(GetErrors.userDoesNotExist());
    }

    // Append the item to the array
    arrOfFollowerData.push(prismaReturn);
  }

  // Return the data
  return res.send(arrOfFollowerData);
});

export default fetchUserFollowers;
