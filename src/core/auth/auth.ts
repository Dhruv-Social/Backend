import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { User } from "core/types/custom";

const authToken = (req: Request | any, res: Response, next: NextFunction) => {
  const auth_header = req.headers["authorization"];
  const token = auth_header && auth_header.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"
  if (token === null) return res.sendStatus(401);

  // Verify the token
  jwt.verify(
    token!,
    process.env.ACCESS_TOKEN_SECRET!,
    (err: any, user: any) => {
      if (err) return res.status(403).json({ result: "Forbidden" });

      req.user = user;
      next();
    }
  );
};

export { authToken };
