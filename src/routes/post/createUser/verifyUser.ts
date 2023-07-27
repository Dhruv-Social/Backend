/* 
  This takes the token from the verification email and 
  will verify the user
*/

// Node imports
import express, { Request, Response, Router } from "express";
import nodemailer from "nodemailer";

// Local imports
import { decryptToken } from "../../../core/jwt/jwt";
import { prisma } from "../../../core/prisma/prisma";
import { PostErrors } from "../../../core/errors/postErrors";
import { redisClient } from "../../../core/redis/redis";

const verifyUser: Router = express.Router();

/* 
  Endpoint to post a user with no email auth 
*/
verifyUser.post("/", async (req: Request, res: Response) => {
  // Get the token from the body
  const { token } = req.body;

  let payload;

  // Get the uuid from the token
  try {
    payload = decryptToken(token);
  } catch (err: any) {
    return res.send({ detail: err });
  }

  const { uuid } = payload;

  // Update the prisma user to verify the user
  await prisma.user.update({
    where: {
      uuid: uuid,
    },
    data: {
      verified: true,
    },
  });

  // Get the data from the database to add to the redis cache
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
  } catch (err) {
    return res
      .status(PostErrors.postUserEmailSendError().details.errorCode)
      .send(PostErrors.postUserEmailSendError());
  }

  return res.send("success");
});

export default verifyUser;
