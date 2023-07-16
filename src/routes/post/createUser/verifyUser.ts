/* 
  This takes the token from the verification email and 
  will verify the user
*/

import express, { Request, Response, Router } from "express";
import nodemailer from "nodemailer";

import { decryptToken } from "../../../core/jwt/jwt";
import { prisma } from "../../../core/prisma/prisma";
import { PostErrors } from "../../../core/errors/errors";
import { redisClient } from "../../../core/redis/redis";

const verifyUser: Router = express.Router();

verifyUser.post("/", async (req: Request, res: Response) => {
  const { token } = req.body;

  let payload;

  try {
    payload = decryptToken(token!);
  } catch (err: any) {
    return res.send({ detail: err });
  }

  const { uuid } = payload;

  await prisma.user.update({
    where: {
      uuid: uuid,
    },
    data: {
      verified: true,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      uuid: uuid,
    },
  });

  // Update the Redis Cache
  const updateRedis = {
    uuid: user?.uuid,
    profilePicture: user?.profilePicture,
    displayName: user?.display_name,
  };

  await redisClient.set(`user:${user?.username}`, JSON.stringify(updateRedis));

  // Send email to user
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const options = {
    from: process.env.EMAIL_USER,
    to: user?.email,
    subject: "Welcome to Dhruv Social",
    text: "welcome to Dhruv Social",
  };

  try {
    await transporter.sendMail(options);
  } catch (err: any) {
    return res
      .status(PostErrors.postUserEmailSendError().details.errorCode)
      .send(PostErrors.postUserEmailSendError());
  }

  return res.send("success");
});

export default verifyUser;
