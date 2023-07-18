import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authToken = (req: Request, res: Response, next: NextFunction) => {
  const auth_header = req.headers["authorization"];
  const token = auth_header && auth_header.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"
  if (token === null || token === undefined) return res.sendStatus(401);

  // Verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any, user: any) => {
    if (err) return res.status(403).json({ result: "Forbidden" });

    req.user = user;
    next();
  });
};

export { authToken };
