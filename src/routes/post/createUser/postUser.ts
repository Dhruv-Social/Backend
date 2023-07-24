/*
  This file will post a user to the database and send 
  them a verification email
*/

// Node imports
import express, { Request, Response, Router } from "express";
import fileUpload from "express-fileupload";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { UploadedFile } from "express-fileupload";

// Local imports
import { verifyArray } from "../../../core/verifyArray/verifyArray";
import { PostErrors } from "../../../core/errors/errors";
import { hashPassword } from "../../../core/argon2/argon";
import {
  verifyUsername,
  verifyPassword,
  verifyLocation,
} from "../../../core/verifyArray/postUserVerify";
import { createToken } from "../../../core/jwt/jwt";
import { IUser, IPostToken } from "../../../core/data/interfaces";
import { prisma } from "../../../core/prisma/prisma";
import {
  defaultProfilePicture,
  defaultProfileBackground,
} from "../../../core/data/data";

const postUser: Router = express.Router();

/* 
  Endpoint to post a user to the database (NOT VERIFIED)
*/
postUser.post("/", fileUpload(), async (req: Request | any, res: Response) => {
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
  } = req.body;

  // Checking if the images are undefined, if so we just give them the default data
  const profilePicture: string =
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
  ];

  if (!verifyArray(arr)) {
    return res
      .status(PostErrors.postUserInvalidDetails().details.errorCode)
      .send(PostErrors.postUserInvalidDetails());
  }

  // Verifying the username
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
    verified: false,
    posts: [],
    profilePicture: profilePicture,
    banner: banner,
    creationDate: Date.now(),
  };

  // Checking to make sure the the user with that username does exist, if so, we return an error
  const prismaReturn = await prisma.user.findUnique({
    where: {
      username: user.username,
    },
  });

  // The prisma return is NOT null, then we know that a user with that usernamee exists
  if (prismaReturn !== null) {
    return res
      .status(PostErrors.postUserUserWithUsernameExists().details.errorCode)
      .send(PostErrors.postUserUserWithUsernameExists());
  }

  // Object to put in the token
  const createTokenData: IPostToken = {
    uuid: user.uuid,
  };

  // Create the token
  const postUserToken = createToken(createTokenData);

  // Sending an email to the user
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const options = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Account",
    text: postUserToken,
  };

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
    },
  });

  try {
    await transporter.sendMail(options);
  } catch (err: any) {
    return res
      .status(PostErrors.postUserEmailSendError().details.errorCode)
      .send(PostErrors.postUserEmailSendError());
  }

  return res.send("success");
});

export default postUser;
