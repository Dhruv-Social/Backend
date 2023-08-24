// Express
import express, { Request, Response, Router } from "express";

// Login imports
import { ITokenPayload, ITokenPayloadScopes } from "../data/interfaces";
import { AuthErrors } from "../errors/authErrors";
import { verifyArray } from "../verifyArray/verifyArray";
import { createToken, decryptTokenRefresh } from "../jwt/jwt";
import { redisClient } from "../redis/redis";

const loginRefresh: Router = express.Router();

// Scopes
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
  Endpoint to login a user from their refreshToken
*/
loginRefresh.post("/", async (req: Request, res: Response) => {
  const { token } = req.body;

  const arr = [token];

  // Verify that the token is not null
  if (!verifyArray(arr))
    return res
      .status(AuthErrors.didNotProvideDetails().details.errorCode)
      .send(AuthErrors.didNotProvideDetails());

  let tokenData;

  // If the decryptToken funciton fails, then we know the token was bad
  try {
    tokenData = decryptTokenRefresh(token);
  } catch (err) {
    return res
      .status(AuthErrors.authFailedToken().details.errorCode)
      .send(AuthErrors.authFailedToken());
  }

  const redisRes = await redisClient.get(`token:${tokenData.uuid}`);

  // If the redis returns null, then we know that the token does not exist
  if (redisRes === null)
    return res
      .status(AuthErrors.authTokenDoesNotExistInRedisCache().details.errorCode)
      .send(AuthErrors.authTokenDoesNotExistInRedisCache());

  // They are using an old refreshToken, if this is true, then we deny the user to get another accessToken
  if (redisRes !== token)
    return res
      .status(AuthErrors.authOldRefreshToken().details.errorCode)
      .send(AuthErrors.authOldRefreshToken());

  // Token Payload
  const tokenDataRefresh: ITokenPayload = {
    uuid: tokenData.uuid,
    scopes: scopes,
  };

  // Return the token
  return res.send({
    accessToken: createToken(tokenDataRefresh),
  });
});

export default loginRefresh;
