import "dotenv/config";

import express, { Request, Response, Application } from "express";
import cors from "cors";
import http from "http";
import path from "path";
import { Server, Socket } from "socket.io";
import { autoDeleteUsers } from "./core/utilities/deleteUser";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { authSocket } from "./sockets/middleware/auth";
import { prisma } from "./core/prisma/prisma";

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
import { Chat } from "@prisma/client";

const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

const port: number = parseInt(process.env.API_PORT!);
const devMode: boolean = process.env.DEV_MODE === "true" ? true : false;

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

app.all("/", async (_: Request, res: Response) => {
  return res.send({ detail: "Welcome to the Dhruv Social API" });
});

io.use(authSocket);

interface privateMessageType {
  to: string;
  message: string;
}

export interface IChatSmall {
  chatUuid: String;
  userUuid: String;
  profilePicture: String;
  displayName: String;
}

let connectedUsers: {
  [key: string]: Socket<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    any
  >;
} = {};

io.on("connection", async (socket) => {
  connectedUsers[socket.uuid] = socket;

  // When they connect to the socket, we want to send their chat's to them
  const chatsUserIsIn = await prisma.chat.findMany({
    where: {
      OR: [
        {
          user_one: socket.uuid,
        },
        {
          user_two: socket.uuid,
        },
      ],
    },
  });

  let chats = [...chatsUserIsIn];

  for (let i = 0; i < chats.length; i++) {
    for (const key in chats[i]) {
      if ((chats[i] as any)[key] === socket.uuid) {
        delete (chats[i] as any)[key];
      }
    }
  }

  let formattedData: IChatSmall[] = [];

  // Get the user data
  for (let i = 0; i < chats.length; i++) {
    const user = await prisma.user.findUnique({
      where: {
        uuid: chats[i].user_one ?? chats[i].user_two,
      },
      select: {
        display_name: true,
        profilePicture: true,
        uuid: true,
      },
    });

    if (user === null) {
      return console.error("an unknown error has occoured");
    }

    formattedData.push({
      chatUuid: chats[i].chat_uuid,
      userUuid: user.uuid,
      profilePicture: user.profilePicture,
      displayName: user.display_name,
    });
  }

  connectedUsers[socket.uuid].emit("chats", formattedData);

  socket.on("message", async (message: privateMessageType) => {
    // Check if they are not in the chat
    const areInChat = await prisma.chat.findMany({
      where: {
        OR: [
          {
            AND: [
              {
                user_one: socket.uuid,
              },
              {
                user_two: message.to,
              },
            ],
          },
          {
            AND: [
              {
                user_one: message.to,
              },
              {
                user_two: socket.uuid,
              },
            ],
          },
        ],
      },
    });

    // Then we know they are not in chat and we should add them
    if (areInChat.length === 0) {
      let chatUuid = crypto.randomUUID();

      // Create Chat
      await prisma.chat.create({
        data: {
          chat_uuid: chatUuid,
          user_one: socket.uuid,
          user_two: message.to,
        },
      });

      // Add message to message table
      await prisma.message.create({
        data: {
          message_uuid: crypto.randomUUID(),
          chat_relation: chatUuid,
          author: socket.uuid,
          to: message.to,
          creatiom_time: Date.now(),
          message: message.message,
        },
      });
    } else {
      // get the their chat uuid
      const chatUuid = await prisma.chat.findMany({
        where: {
          OR: [
            {
              AND: [
                {
                  user_one: socket.uuid,
                },
                {
                  user_two: message.to,
                },
              ],
            },
            {
              AND: [
                {
                  user_one: message.to,
                },
                {
                  user_two: socket.uuid,
                },
              ],
            },
          ],
        },
      });

      const uuid = chatUuid[0].chat_uuid;

      // Create a new message item
      await prisma.message.create({
        data: {
          message_uuid: crypto.randomUUID(),
          chat_relation: uuid,
          author: socket.uuid,
          to: message.to,
          creatiom_time: Date.now(),
          message: message.message,
        },
      });
    }

    // Send the message to the other person if they are connected to the socket
    if (connectedUsers[message.to] !== undefined) {
      connectedUsers[message.to].emit("privateMessage", {
        from: socket.uuid,
        to: connectedUsers[message.to].uuid,
        message: message.message,
      });
    }
  });

  socket.on("disconnect", () => {
    delete connectedUsers[socket.uuid];
  });
});

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
