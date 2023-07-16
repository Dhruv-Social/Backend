import express, { Request, Response, Router } from "express";

import { prisma } from "../../core/prisma/prisma";

const fetchAllUsers: Router = express.Router();

// Endpoint to get all the users from the database
fetchAllUsers.get("/", async (req: Request, res: Response) => {
  /* 
    `const users = await prisma.user.findMany();` is fetching all the users from the database using
    Prisma's `findMany()` method. This method retrieves multiple records from the specified table, in
    this case, the "user" table. The retrieved users are then stored in the `users` variable. 
  */
  const users = await prisma.user.findMany();

  users.map((user: any) => {
    user.creationDate = user.creationDate.toString();
  });

  return res.send(users);
});

export default fetchAllUsers;
