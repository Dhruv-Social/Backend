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

const onConnection = async (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  connectedUsers[socket.uuid] = socket;

  onMessage(socket);

  onDisconnect(socket);
};

export default onConnection;
