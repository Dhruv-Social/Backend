/*
  This file will post a user to the database and send 
  them a verification email
*/

import express, { Request, Response, Router } from "express";
const fileUpload = require("express-fileupload");
import crypto from "crypto";
import nodemailer from "nodemailer";

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

// This route is to get a user based on their username
postUser.post("/", fileUpload(), async (req: Request | any, res: Response) => {
  let banner;
  let profilePicture;

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

  console.log(req.files.banner);

  // Checking to make sure the files were uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  profilePicture =
    req.files.profile_picture !== undefined
      ? req.files.profilePicture.data.toString("base64")
      : defaultProfilePicture;
  banner =
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

  if (!verifyUsername(username)) {
    return res
      .status(PostErrors.postUserUsernameFailed().details.errorCode)
      .send(PostErrors.postUserUsernameFailed());
  }

  if (!verifyPassword(password)) {
    return res
      .status(PostErrors.postUserPasswordFailed().details.errorCode)
      .send(PostErrors.postUserPasswordFailed());
  }

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
  let prismaReturn = await prisma.user.findUnique({
    where: {
      username: user.username,
    },
  });

  if (prismaReturn !== null) {
    return res
      .status(PostErrors.postUserUserWithUsernameExists().details.errorCode)
      .send(PostErrors.postUserUserWithUsernameExists());
  }

  let createTokenData: IPostToken = {
    uuid: user.uuid,
  };

  let postUserToken = createToken(createTokenData);

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
