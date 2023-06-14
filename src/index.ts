import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";

import { autoDeleteUsers } from "./core/utilities/deleteUser";

dotenv.config();

// Import Routes
// Auth
import loginAuth from "./core/auth/login";

// Get
import fetchSelf from "./routes/get/fetchSelf";
import fetchOther from "./routes/get/fetchOther";

// Post
import postUser from "./routes/post/createUser/postUser";
import verifyUser from "./routes/post/createUser/verifyUser";

import createPost from "./routes/post/makePost/createPost";

const app: Application = express();
const port: number = parseInt(process.env.API_PORT!);
const devMode: boolean = process.env.DEV_MODE === "true" ? true : false;

app.use(express.json());

// Use Routes
// Auth
app.use("/dhruvsocial/auth/loginAuth", loginAuth);

app.use("/dhruvsocial/get/fetchSelf", fetchSelf);
app.use("/dhruvsocial/get/fetchOther", fetchOther);

// Post
app.use("/dhruvsocial/post/postUser", postUser);
app.use("/dhruvsocial/post/verifyUser", verifyUser);

app.use("/dhruvsocial/post/createPost", createPost);

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
