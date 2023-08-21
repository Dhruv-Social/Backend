/*
  This file is to post a user to a database without email 
  authentication
*/

// Node imports
import express, { Request, Response, Router } from "express";
import fileUpload from "express-fileupload";
import crypto from "crypto";

// Local imports
import { verifyArray } from "../../../core/verifyArray/verifyArray";
import { PostErrors } from "../../../core/errors/postErrors";
import { hashPassword } from "../../../core/argon2/argon";
import {
  verifyUsername,
  verifyPassword,
  verifyLocation,
} from "../../../core/verifyArray/postUserVerify";
import { IUser } from "../../../core/data/interfaces";
import { prisma } from "../../../core/prisma/prisma";
import {
  defaultProfilePicture,
  defaultProfileBackground,
} from "../../../core/data/data";
import { redisClient } from "../../../core/redis/redis";

const postUserNoAuth: Router = express.Router();

/* 
  Endpoint to post a user with no email auth 
*/
postUserNoAuth.post(
  "/",
  fileUpload(),
  async (req: Request | any, res: Response) => {
    // Request data
    const {
      username,
      display_name,
      firstname,
      lastname,
      email,
      phonenumber,
      password,
      description,
      location,
      publicKey,
    } = req.body;

    // Checking if the images are undefined, if so we just give them the default datas
    const profilePicture =
      req.files.profilePicture !== undefined
        ? req.files.profilePicture.data.toString("base64")
        : defaultProfilePicture;
    const banner =
      req.files.banner !== undefined
        ? req.files.banner.data.toString("base64")
        : defaultProfileBackground;

    // Here we verifying the data, if it is not correct then we return an error to the user.w
    const arr: string[] = [
      username,
      display_name,
      firstname,
      lastname,
      email,
      phonenumber,
      password,
      description,
      location,
      publicKey,
    ];

    if (!verifyArray(arr)) {
      return res
        .status(PostErrors.postUserInvalidDetails().details.errorCode)
        .send(PostErrors.postUserInvalidDetails());
    }

    // Verify the username
    if (!verifyUsername(username)) {
      return res
        .status(PostErrors.postUserUsernameFailed().details.errorCode)
        .send(PostErrors.postUserUsernameFailed());
    }

    // Verify the password
    if (!verifyPassword(password)) {
      return res
        .status(PostErrors.postUserPasswordFailed().details.errorCode)
        .send(PostErrors.postUserPasswordFailed());
    }

    // Verify the location
    if (!verifyLocation(location)) {
      return res
        .status(PostErrors.postUserLocationFailed().details.errorCode)
        .send(PostErrors.postUserLocationFailed());
    }

    // Creating a user object
    const user: IUser = {
      uuid: crypto.randomUUID(),
      username: username,
      display_name: display_name,
      firstname: firstname,
      lastname: lastname,
      email: email,
      phonenumber: phonenumber,
      password: await hashPassword(password),
      description: description,
      location: location,
      followers: [],
      following: [],
      verified: true,
      posts: [],
      profilePicture: profilePicture,
      banner: banner,
      creationDate: Date.now(),
      publicKey: publicKey,
    };

    // Checking to make sure the the user with that username does exist, if so, we return an error
    const prismaReturn = await prisma.user.findUnique({
      where: {
        username: user.username,
      },
    });

    // Checking to make sure the the user with that username does exist, if so, we return an error
    if (prismaReturn !== null) {
      return res
        .status(PostErrors.postUserUserWithUsernameExists().details.errorCode)
        .send(PostErrors.postUserUserWithUsernameExists());
    }

    // Posting the user to the database
    await prisma.user.create({
      data: {
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
        creationDate: user.creationDate,
        publicKey: user.publicKey,
      },
    });

    // Updaing the redis cache
    const updateRedis = {
      uuid: user?.uuid,
      profilePicture: user?.profilePicture,
      displayName: user?.display_name,
    };

    await redisClient.set(
      `user:${user?.username}`,
      JSON.stringify(updateRedis)
    );

    return res.send("success");
  }
);

export default postUserNoAuth;
