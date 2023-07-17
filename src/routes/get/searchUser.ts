import express, { Request, Response, Router } from "express";

import { authToken } from "../../core/auth/auth";
import { redisClient } from "../../core/redis/redis";

const searchUser: Router = express.Router();

interface redisUser {
  uuid: string;
  profilePicture: string;
  displayName: string;
}

// Endpoint to get a users data
searchUser.get("/", authToken, async (req: Request | any, res: Response) => {
  const { user } = req.query;
  const { uuid } = req.user;

  const userData: redisUser[] = [];

  const similarUsersArr = await redisClient.keys(`*user:${user}*`);

  for (let i = 0; i < similarUsersArr.length; i++) {
    const userJsonString = await redisClient.get(similarUsersArr[i]);

    if (userJsonString === null) {
      return res.send("User can not be found.");
    }

    userData.push(JSON.parse(userJsonString));
  }

  const filteredData = userData.filter((user: redisUser) => user.uuid !== uuid);

  return res.send(filteredData);
});

export default searchUser;
