import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";

import { autoDeleteUsers } from "./core/utilities/deleteUser";

dotenv.config();

// Import Routes
import getSpecificUserRoute from "./routes/get/getSpecificUser";
import postUser from "./routes/post/postUser";

const app: Application = express();
const port: number = parseInt(process.env.API_PORT!);
const devMode: boolean = process.env.DEV_MODE === "true" ? true : false;

// Use Routes
app.use("/dhruvsocial/getSpecificUser", getSpecificUserRoute);
app.use("/dhruvsocial/postUser", postUser);

app.all("/", async (req: Request, res: Response) => {
  return res.send({ detail: "Welcome to the Dhruv Social API" });
});

// Fallback
app.all("*", async (req: Request, res: Response) => {
  return res.send({
    detail: "This endpoint does not exist.",
    endpoint: { detail: `'${req.url}' does not exist.` },
  });
});

app.listen(port, async () => {
  console.log(`Listening on port ${port}`);
  autoDeleteUsers();
});
