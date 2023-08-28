import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { prisma } from "../../core/prisma/prisma";
import { onMessage } from "./messages";
import { onDisconnect } from "./disconnect";

export let connectedUsers: {
  [key: string]: Socket<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    any
  >;
} = {};

interface IChatSmall {
  chatUuid: String;
  userUuid: String;
  profilePicture: String;
  displayName: String;
}

const onConnection = async (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
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

  onMessage(socket);

  connectedUsers[socket.uuid].emit("chats", formattedData);

  onDisconnect(socket);
};

export default onConnection;
