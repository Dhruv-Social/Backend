import express, { Request, Response, Router } from "express";

import { prisma } from "../../core/prisma/prisma";
import { authToken } from "../../core/auth/auth";

const fetchSelf: Router = express.Router();

interface IUserString {
  uuid: string;
  username: string;
  display_name: string;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  password: string;
  description: string;
  location: string;
  followers: string[];
  following: string[];
  verified: boolean;
  posts: string[];
  profilePicture: string;
  banner: string;
  creationDate: string;
}

// Endpoint to get a users own data
fetchSelf.get("/", authToken, async (req: Request, res: Response) => {
  const { uuid } = req.user;

  const user = await prisma.user.findUnique({
    where: {
      uuid: uuid,
    },
  });

  if (user === null) {
    return res.send({ detail: "You do not exist" });
  }

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

  return res.send(returnUser);
});

export default fetchSelf;
