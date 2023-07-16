import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { redisClient } from "./core/redis/redis";
import { autoDeleteUsers } from "./core/utilities/deleteUser";

dotenv.config();

// Import Routes
// Auth
import loginAuth from "./core/auth/login";

// Get
import fetchSelf from "./routes/get/fetchSelf";
import fetchOther from "./routes/get/fetchOther";
import fetchAllUsers from "./routes/get/fetchAllUsers";
import fetchUserFollowers from "./routes/get/fetchUserFollowers";
import fetchUserFollowing from "./routes/get/fetchUserFollowing";
import reels from "./routes/get/reels";
import forYouPosts from "./routes/get/forYouPosts";
import fetchUsersPosts from "./routes/get/fetchUserPost";
import searchUser from "./routes/get/searchUser";
import fetchIfFollowing from "./routes/get/fetchIfFollowing";

// Post
import postUser from "./routes/post/createUser/postUser";
import verifyUser from "./routes/post/createUser/verifyUser";
import postUserNoAuth from "./routes/post/createUser/postUserNoEmailAuth";

import createPost from "./routes/post/makePost/createPost";

// Delete
import deletePost from "./routes/delete/deletePost";

// Put
import followUser from "./routes/put/followUser";
import unfollowUser from "./routes/put/unfollowUser";
import commentOnPost from "./routes/put/commentOnPost";
import likePost from "./routes/put/likePost";

const app: Application = express();
const port: number = parseInt(process.env.API_PORT!);
const devMode: boolean = process.env.DEV_MODE === "true" ? true : false;

app.use(express.json());
app.use(cors());

// Use Routes
// Auth
app.use("/dhruvsocial/auth/loginAuth", loginAuth);

// Get
app.use("/dhruvsocial/get/fetchSelf", fetchSelf);
app.use("/dhruvsocial/get/fetchOther", fetchOther);
app.use("/dhruvsocial/get/fetchAllUsers", fetchAllUsers);
app.use("/dhruvsocial/get/fetchUserFollowers", fetchUserFollowers);
app.use("/dhruvsocial/get/fetchUserFollowing", fetchUserFollowing);
app.use("/dhruvsocial/get/reels", reels);
app.use("/dhruvsocial/get/forYouPosts", forYouPosts);
app.use("/dhruvsocial/get/fetchUsersPosts", fetchUsersPosts);
app.use("/dhruvsocial/get/searchUser", searchUser);
app.use("/dhruvsocial/get/fetchIfFollowing", fetchIfFollowing);

// Post
app.use("/dhruvsocial/post/postUser", postUser);
app.use("/dhruvsocial/post/verifyUser", verifyUser);
app.use("/dhruvsocial/post/postUserNoAuth", postUserNoAuth);

app.use("/dhruvsocial/post/createPost", createPost);

// Delete
app.use("/dhruvsocial/delete/deletePost", deletePost);

// Put
app.use("/dhruvsocial/put/followUser", followUser);
app.use("/dhruvsocial/put/unfollowUser", unfollowUser);
app.use("/dhruvsocial/put/commentOnPost", commentOnPost);
app.use("/dhruvsocial/put/likePost", likePost);

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
