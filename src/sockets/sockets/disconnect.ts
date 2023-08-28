import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { connectedUsers } from "./connect";

const onDisconnect = async (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  socket.on("disconnect", () => {
    delete connectedUsers[socket.uuid];
  });
};

export { onDisconnect };
