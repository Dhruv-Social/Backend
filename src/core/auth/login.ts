import express, { Request, Response, Router } from "express";

import { verifyPassword } from "../argon2/argon";
import { prisma } from "../prisma/prisma";
import {
  IUserLogin,
  ITokenPayload,
  ITokenPayloadScopes,
} from "../data/interfaces";
import { AuthErrors } from "../errors/authErrors";
import { verifyArray } from "../verifyArray/verifyArray";
import {
  createToken,
  createRefreshToken,
  decryptTokenRefresh,
} from "../jwt/jwt";
import { redisClient } from "../redis/redis";

const loginAuth: Router = express.Router();

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

loginAuth.post("/", async (req: Request | any, res: Response) => {
  const { username, password } = req.body;

  const arr: string[] = [username, password];

  if (!verifyArray(arr)) {
    return res
      .status(AuthErrors.didNotProvideDetails().details.errorCode)
      .send(AuthErrors.didNotProvideDetails());
  }

  const user: IUserLogin = {
    username: username,
    password: password,
  };

  const prismaReturn = await prisma.user.findUnique({
    where: {
      username: user.username,
    },
    select: {
      password: true,
      uuid: true,
    },
  });

  if (prismaReturn === null) {
    return res
      .status(AuthErrors.authUserDoesNotExist().details.errorCode)
      .send(AuthErrors.authUserDoesNotExist());
  }

  if (!(await verifyPassword(prismaReturn.password, user.password))) {
    return res
      .status(AuthErrors.authPasswordIncorrect().details.errorCode)
      .send(AuthErrors.authPasswordIncorrect());
  }

  const tokenData: ITokenPayload = {
    uuid: prismaReturn.uuid,
    scopes: scopes,
  };

  const refreshToken = createRefreshToken(prismaReturn.uuid);

  redisClient.set(`token:${prismaReturn.uuid}`, refreshToken);

  res.send({
    accessToken: createToken(tokenData),
    refreshToken: refreshToken,
  });
});

export default loginAuth;
