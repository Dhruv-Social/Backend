// Express
import express, { Request, Response, Router } from "express";

// Local imports
import { verifyPassword } from "../argon2/argon";
import { prisma } from "../prisma/prisma";
import {
  IUserLogin,
  ITokenPayload,
  ITokenPayloadScopes,
} from "../data/interfaces";
import { AuthErrors } from "../errors/authErrors";
import { verifyArray } from "../verifyArray/verifyArray";
import { createToken, createRefreshToken } from "../jwt/jwt";
import { redisClient } from "../redis/redis";

const loginAuth: Router = express.Router();

// Scopes Const
const scopes: ITokenPayloadScopes = {
  dhruv_canUpdateUsers: false,
  dhruv_canDeleteUsers: false,
  dhruv_canGod: false,
  canEditSelf: true,
  canMakePost: true,
  canCreateUser: false,
  canSendMessages: true,
  canUserFetchSelf: true,
  canReadOtherProfiles: true,
  canDeleteSelf: true,
};

/* 
  Endpoint to log in a user and provide them with a token
*/
loginAuth.post("/", async (req: Request | any, res: Response) => {
  const { username, password } = req.body;

  const arr: string[] = [username, password];

  // Verify the user data
  if (!verifyArray(arr)) {
    return res
      .status(AuthErrors.didNotProvideDetails().details.errorCode)
      .send(AuthErrors.didNotProvideDetails());
  }

  // Create a user object
  const user: IUserLogin = {
    username: username,
    password: password,
  };

  // get the password and UUID from where the username is equal to their username
  const prismaReturn = await prisma.user.findUnique({
    where: {
      username: user.username,
    },
    select: {
      password: true,
      uuid: true,
    },
  });

  // If null, we return because we know they do not exist
  if (prismaReturn === null) {
    return res
      .status(AuthErrors.authUserDoesNotExist().details.errorCode)
      .send(AuthErrors.authUserDoesNotExist());
  }

  // If the verify password function returns false, then we know that provided the wrong password
  if (!(await verifyPassword(prismaReturn.password, user.password))) {
    return res
      .status(AuthErrors.authPasswordIncorrect().details.errorCode)
      .send(AuthErrors.authPasswordIncorrect());
  }

  // Create a token data object
  const tokenData: ITokenPayload = {
    uuid: prismaReturn.uuid,
    scopes: scopes,
  };

  // Create a refreshToken
  const refreshToken = createRefreshToken(prismaReturn.uuid);

  // update the redis cache
  redisClient.set(`token:${prismaReturn.uuid}`, refreshToken);

  // Return the data
  return res.send({
    accessToken: createToken(tokenData),
    refreshToken: refreshToken,
  });
});

export default loginAuth;
