import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * This function authticates a token that the user provided in the http header
 * @param req Request Object from express
 * @param res Response Object from express
 * @param next Next function caller
 * @returns an error, not void
 */
const authToken = (req: Request, res: Response, next: NextFunction) => {
  // Get the token from the header
  const auth_header = req.headers["authorization"];
  const token = auth_header && auth_header.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"

  // If the token is null or undefined, then we return http error code: 401 (Unauthorized)
  if (token === null || token === undefined) return res.sendStatus(401);

  // Verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any, user: any) => {
    // If there was an error, we return http error code: 403 (Forbidden)
    if (err) return res.status(403).json({ result: "Forbidden" });

    // Else we set the user in the request item
    req.user = user;

    // Proceed to the next middleware or the endpoint
    next();
  });
};

export { authToken };
