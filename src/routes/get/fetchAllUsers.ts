import express, { Request, Response, Router } from "express";

import { prisma } from "../../core/prisma/prisma";

const fetchAllUsers = express.Router();

fetchAllUsers.get("/", async (req, res) => {
  const users = await prisma.user.findMany();

  return res.send(users);
});

export default fetchAllUsers;
