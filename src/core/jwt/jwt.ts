import { redisClient } from "../redis/redis";
import jwt from "jsonwebtoken";

/**
 * Creates a token with jwt and 64 random bytes :)))
 * @param user Not the hashed password
 * @return Returns a token
 */
const createToken = (user: any): any => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1h",
  });
};

/**
 * Creates a token with jwt and 64 random bytes :)))
 * @param uuid
 * @return Returns a token
 */
const createRefreshToken = (uuid: string): any => {
  return jwt.sign({ uuid: uuid }, process.env.REFRESH_TOKEN_SECRET!);
};

/**
 * Decrypt a JWT token so you can use the values
 * @param token jwt token
 * @returns a dictionary of the values in the token
 */
const decryptToken = (token: any): any => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
};

/**
 * Decrypt a JWT refresh token so you can use the values
 * @param token jwt token
 * @returns a dictionary of the values in the token
 */

const decryptTokenRefresh = (token: any): any => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
};

/**
 * Function to verify a JWT token
 * @param token JWT refresh token
 * @returns boolean if the token is our token or not
 */
const verifyRefreshToken = async (token: string): Promise<boolean> => {
  let payload;

  // Verify the token to make sure it is actually a real token
  try {
    payload = decryptTokenRefresh(token);
  } catch {
    return false;
  }

  // Check the redis cache for the token
  const redisRes = await redisClient.get(`token:${payload.uuid}`);

  // If the redis cache is null, then it does not exist
  if (redisRes === null) return false;

  // They are using an old refreshToken, if this is true, then we deny the user to get another accessToken
  if (redisRes !== token) return false;

  return true;
};

export {
  createToken,
  createRefreshToken,
  decryptToken,
  decryptTokenRefresh,
  verifyRefreshToken,
};
