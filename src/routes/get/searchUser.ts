import express, { Request, Response, Router } from "express";

import { authToken } from "../../core/auth/auth";
import { redisClient } from "../../core/redis/redis";

const searchUser: Router = express.Router();

// Endpoint to get a users data
searchUser.get("/", authToken, async (req: Request, res: Response) => {
  const { user } = req.query;

  const userData: object[] = [];

  const similarUsersArr = await redisClient.keys(`*user:${user}*`);

  for (let i = 0; i < similarUsersArr.length; i++) {
    const userJsonString = await redisClient.get(similarUsersArr[i]);

    if (userJsonString === null) {
      return res.send("User can not be found.");
    }

    userData.push(JSON.parse(userJsonString));
  }

  userData.filter((user: any) => user.uuid === user);

  return res.send(userData);
});

export default searchUser;
