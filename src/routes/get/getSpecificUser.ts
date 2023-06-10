import express, { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

import { Errors } from "../../core/errors/errors";

const getSpecificUserRoute: Router = express.Router();

// This route is to get a user based on their username
getSpecificUserRoute.get("/", async (req: Request, res: Response) => {
  const { username } = req.query;

  // check if username is not provided
  if (typeof username !== "string" || username === "") {
    return res
      .status(Errors.didNotProvideUsername().details.errorCode)
      .send(Errors.didNotProvideUsername());
  }

  const prisma = new PrismaClient();

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  return res.send(user);
});

export default getSpecificUserRoute;
