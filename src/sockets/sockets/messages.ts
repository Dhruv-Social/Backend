import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { prisma } from "../../core/prisma/prisma";
import { connectedUsers } from "./connect";

interface IPrivateMessageType {
  to: string;
  message: string;
}

const onMessage = async (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
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
      connectedUsers[message.to].emit("privateMessage", {
        from: socket.uuid,
        to: connectedUsers[message.to].uuid,
        message: message.message,
      });
    }
  });
};

export { onMessage };
