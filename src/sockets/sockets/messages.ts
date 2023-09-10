import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { prisma } from "../../core/prisma/prisma";
import { connectedUsers } from "./connect";

interface IPrivateMessageType {
  to: string;
  message: string;
}

interface IChatSmall {
  chatUuid: String;
  userUuid: String;
  profilePicture: String;
  displayName: String;
}

const onMessage = async (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  socket.on("returnChats", async () => {
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
  });

  socket.on("message", async (message: IPrivateMessageType) => {
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
      for (const [key, value] of Object.entries(connectedUsers)) {
        console.log(key);
      }

      connectedUsers[message.to].emit("privateMessage", {
        from: socket.uuid,
        to: connectedUsers[message.to].uuid,
        message: message.message,
      });
    }
  });
};

export { onMessage };
