// Expess
import express, { Request, Response, Router } from "express";

// Local imports
import { prisma } from "../../core/prisma/prisma";

const fetchAllUsers: Router = express.Router();

/* 
  Endpoint to fetch all the users from a database
*/
fetchAllUsers.get("/", async (req: Request, res: Response) => {
  // All the users
  const users = await prisma.user.findMany();

  /*
    Loop over the users and set the creation date to a string, 
    doing this because json converts a big int to 123123213123n
  */
  users.map((user: any) => {
    user.creationDate = user.creationDate.toString();
  });

  // Return the users
  return res.send(users);
});

export default fetchAllUsers;
