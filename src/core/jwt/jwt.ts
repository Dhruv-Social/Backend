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

export { createToken, createRefreshToken, decryptToken, decryptTokenRefresh };
