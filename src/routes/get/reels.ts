// Express
import express, { Request, Response, Router } from "express";
import path from "path";
import fs from "fs";

// Local imports
import { GetErrors } from "../../core/errors/errors";
import { authToken } from "../../core/auth/auth";

const reels: Router = express.Router();

/* 
  Endpoint to get a users own data 
*/
reels.get("/", authToken, async (req: Request, res: Response) => {
  // Read the directory
  fs.readdir(
    path.join(`${process.cwd()}/src/public/capybara`),
    (err, files) => {
      if (err) {
        return res
          .status(GetErrors.reelsError().details.errorCode)
          .send(GetErrors.reelsError());
      }

      // Valyes
      const max = files.length - 1;
      const min = 0;

      // Find get a random number
      const index = Math.round(Math.random() * (max - min) + min);

      // Send the file
      res.sendFile(`${process.cwd()}/src/public/capybara/${files[index]}`);
    }
  );
});

export default reels;
