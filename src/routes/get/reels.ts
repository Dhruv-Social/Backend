// Express
import express, { Request, Response, Router } from "express";

// Local imports
import { authToken } from "../../core/auth/auth";

const reels: Router = express.Router();

/* 
  Endpoint to get reels for a user 
*/
reels.get("/", async (req: Request, res: Response) => {
  // set variable for reels
  let reels = [
    "http://localhost:3000/reels/racism.webm",
    "http://localhost:3000/reels/capybara.webm",
    "http://localhost:3000/reels/cat.webm",
  ];

  const max = 3;
  const min = 0;

  const randomNumber = Math.floor(Math.random() * (max - min) + min);

  console.log(randomNumber);

  return res.send({
    reelUrl: reels[randomNumber],
  });
});

export default reels;
