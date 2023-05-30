import express, { Request, Response, Application } from "express";
require("dotenv").config();

const app: Application = express();
let port: number = parseInt(process.env.API_PORT!);
let devMode: boolean = process.env.DEV_MODE === "true" ? true : false;

app.all("*", async (req: Request, res: Response) => {
  return res.send({
    detail: "This endpoint does not exist.",
    endpoint: { detail: `'${req.url}' does not exist.` },
  });
});

app.listen(port, async () => {
  console.log(`Listening on port ${port}`);
});
