// Express
import express, { Request, Response, Router } from "express";

// Local Imports
import { prisma } from "../../core/prisma/prisma";
import { authToken } from "../../core/auth/auth";
import { IUserString } from "../../core/data/interfaces";
import { GetErrors } from "../../core/errors/getErrors";

const fetchSelf: Router = express.Router();

/* 
  Endpoint to fetch a user from the token provided in the request headers
*/
fetchSelf.get("/", authToken, async (req: Request, res: Response) => {
  // Get the uuid from the request token
  const { uuid } = req.user;

  // Get the user where the uuid is equal the the token uuid
  const user = await prisma.user.findUnique({
    where: {
      uuid: uuid,
    },
  });

  // If prisma returns none, then we know the user does not exist
  if (user === null) {
    return res
      .status(GetErrors.userDoesNotExist().details.errorCode)
      .send(GetErrors.userDoesNotExist());
  }

  // This is the return user object
  const returnUser: IUserString = {
    uuid: user.uuid,
    username: user.username,
    display_name: user.display_name,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phonenumber: user.phonenumber,
    password: user.password,
    description: user.description,
    location: user.location,
    followers: user.followers,
    following: user.following,
    verified: user.verified,
    posts: user.posts,
    profilePicture: user.profilePicture,
    banner: user.banner,
    creationDate: user.creationDate.toString(),
  };

  // Return the user
  return res.send(returnUser);
});

export default fetchSelf;
