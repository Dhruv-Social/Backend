import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";

import { verifyPassword } from "../argon2/argon";
import { prisma } from "../prisma/prisma";
import {
  IUserLogin,
  ITokenPayload,
  ITokenPayloadScopes,
} from "../data/interfaces";
import { PostErrors, AuthErrors } from "../errors/errors";
import { verifyArray } from "../verifyArray/verifyArray";
import { createToken } from "../jwt/jwt";

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
      .status(PostErrors.postUserInvalidDetails().details.errorCode)
      .send(PostErrors.postUserInvalidDetails());
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

  res.send({
    accessToken: createToken(tokenData),
  });
});

export default loginAuth;
