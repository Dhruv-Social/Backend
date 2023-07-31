import express, { Request, Response, Router } from "express";

import { ITokenPayload, ITokenPayloadScopes } from "../data/interfaces";
import { AuthErrors } from "../errors/authErrors";
import { verifyArray } from "../verifyArray/verifyArray";
import { createToken, decryptTokenRefresh } from "../jwt/jwt";
import { redisClient } from "../redis/redis";

const loginRefresh: Router = express.Router();

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

loginRefresh.post("/", async (req: Request, res: Response) => {
  const { token } = req.body;

  const arr = [token];

  if (!verifyArray(arr))
    return res
      .status(AuthErrors.didNotProvideDetails().details.errorCode)
      .send(AuthErrors.didNotProvideDetails());

  let tokenData;

  try {
    tokenData = decryptTokenRefresh(token);
  } catch (err) {
    return res.status(400).send({ detail: "How dare you give me a bad token" });
  }

  const redisRes = await redisClient.get(`token:${tokenData.uuid}`);

  if (redisRes === null)
    return res.status(400).send({ detail: "You do not exist in the database" });

  if (redisRes !== token)
    return res.status(400).send({
      detail: "You must only use a new your latest refresh token",
    });

  const tokenDataRefresh: ITokenPayload = {
    uuid: tokenData.uuid,
    scopes: scopes,
  };

  res.send({
    accessToken: createToken(tokenDataRefresh),
  });
});

export default loginRefresh;
