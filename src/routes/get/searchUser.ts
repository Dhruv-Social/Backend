// Express
import express, { Request, Response, Router } from "express";

// Local imports
import { authToken } from "../../core/auth/auth";
import { redisClient } from "../../core/redis/redis";

const searchUser: Router = express.Router();

interface redisUser {
  uuid: string;
  profilePicture: string;
  displayName: string;
}

/* 
  Endpoint to search a user in the redis database
 */
searchUser.get("/", authToken, async (req: Request, res: Response) => {
  // Request data
  const { user } = req.query;
  const { uuid } = req.user;

  const userData: redisUser[] = [];

  // Get the keys from redis where the key starts with `*user:{key}*`
  const similarUsersArr = await redisClient.keys(`*user:${user}*`);

  // Loop over the users fetched
  for (let i = 0; i < similarUsersArr.length; i++) {
    const userJsonString = await redisClient.get(similarUsersArr[i]);

    // if the json is null, then we know the user can not be found
    if (userJsonString === null) {
      return res.send("User can not be found.");
    }

    // Append this data to the array
    userData.push(JSON.parse(userJsonString));
  }

  // Filter the data so it does not include themself
  const filteredData = userData.filter((user: redisUser) => user.uuid !== uuid);

  // Return the data
  return res.send(filteredData);
});

export default searchUser;
