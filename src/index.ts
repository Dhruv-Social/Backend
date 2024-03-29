import "dotenv/config";

import express, { Request, Response, Application } from "express";
import cors from "cors";
import http from "http";
import path from "path";

import { Server } from "socket.io";
import { autoDeleteUsers } from "./core/utilities/deleteUser";
import { authSocket } from "./sockets/middleware/auth";

import onConnection from "./sockets/sockets/connect";

// Import Routes
// Auth
import loginAuth from "./core/auth/login";
import loginRefresh from "./core/auth/refreshLogin";

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
import fetchOtherPosts from "./routes/get/fetchOtherPosts";
import fetchIfPostLiked from "./routes/get/fetchIfLikedPost";
import getChatMessages from "./routes/get/getChatMessages";

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
import unLikePost from "./routes/put/unLikePost";

// Serve Html
import verifyEmailHtml from "./routes/html/verifyEmail/verifyEmail";

const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

const port: number = parseInt(process.env.API_PORT!);

app.use(express.json());
app.use(cors());

// Use Routes
// Auth
app.use("/dhruvsocial/auth/loginAuth", loginAuth);
app.use("/dhruvsocial/auth/loginAuth/refresh", loginRefresh);

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
app.use("/dhruvsocial/get/fetchOtherPosts", fetchOtherPosts);
app.use("/dhruvsocial/get/fetchIfPostLiked", fetchIfPostLiked);
app.use("/dhruvsocial/get/getChatMessages", getChatMessages);

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
app.use("/dhruvsocial/get/unlikePost", unLikePost);

// Serve Html
app.use("/dhruvsocial/secure/verifyEmail", verifyEmailHtml);

// Serve static files
app.use("/static", express.static(path.join(__dirname, "core/email/images")));
app.use("/reels", express.static(path.join(__dirname, "public/capybara")));

app.all("/", async (_: Request, res: Response) => {
  return res.send({ detail: "Welcome to the Dhruv Social API" });
});

io.use(authSocket);

io.on("connection", onConnection);

// Fallback
app.all("*", async (req: Request, res: Response) => {
  return res.send({
    detail: "This endpoint does not exist.",
    endpoint: { detail: `'${req.url}' does not exist.` },
  });
});

server.listen(port, async () => {
  console.log(`Listening on port ${port}`);
  await autoDeleteUsers();
});

export { io };
