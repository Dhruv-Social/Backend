// Node imports
import express, { Request, Response, Router } from "express";
import path from "path";

const verifyEmailHtml: Router = express.Router();

verifyEmailHtml.get("/", (req: Request, res: Response) => {
  return res.sendFile(
    path.join(__dirname + "/../../../public/verifyEmail/verifyEmail.html")
  );
});

export default verifyEmailHtml;
