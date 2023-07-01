import express, { Request, Response, Router } from "express";

import { prisma } from "../../core/prisma/prisma";

const fetchAllUsers = express.Router();

// Endpoint to get all the users from the database
fetchAllUsers.get("/", async (req, res) => {
  /* 
    `const users = await prisma.user.findMany();` is fetching all the users from the database using
    Prisma's `findMany()` method. This method retrieves multiple records from the specified table, in
    this case, the "user" table. The retrieved users are then stored in the `users` variable. 
  */
  const users = await prisma.user.findMany();

  return res.send(users);
});

export default fetchAllUsers;
