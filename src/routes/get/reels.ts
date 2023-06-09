import express, { Request, Response, Router } from "express";
import path from "path";
import fs from "fs";

import { GetErrors } from "../../core/errors/errors";

const reels: Router = express.Router();

// Endpoint to get a users own data
reels.get("/", async (req: Request, res: Response) => {
  fs.readdir(
    path.join(`${process.cwd()}/src/public/capybara`),
    (err, files) => {
      if (err) {
        return res
          .status(GetErrors.reelsError().details.errorCode)
          .send(GetErrors.reelsError());
      }
      const max = files.length - 1;
      const min = 0;

      const index = Math.round(Math.random() * (max - min) + min);

      res.sendFile(`${process.cwd()}/src/public/capybara/${files[index]}`);
    }
  );
});

export default reels;
