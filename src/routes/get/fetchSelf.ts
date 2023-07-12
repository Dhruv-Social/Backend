import express, { Request, Response, Router } from "express";

import { prisma } from "../../core/prisma/prisma";
import { authToken } from "../../core/auth/auth";

const fetchSelf: Router = express.Router();

// Endpoint to get a users own data
fetchSelf.get("/", authToken, async (req: Request | any, res: Response) => {
  const { uuid } = req.user;

  const user = await prisma.user.findUnique({
    where: {
      uuid: uuid,
    },
  });

  const returnUser: any = { ...user };
  returnUser.creationDate = returnUser.creationDate?.toString();

  return res.send(returnUser);
});

export default fetchSelf;
