import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { verifyRefreshToken } from "../../core/jwt/jwt";
import { getUsername } from "../../core/utilities/getUsernameFromToken";

const authSocket = async (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void
) => {
  let token = socket.handshake.auth.token;

  // verify token
  if (!(await verifyRefreshToken(token))) {
    return next(new Error("Invalid Session Token"));
  }

  // get the username
  let username = await getUsername(token);

  socket.username = username;

  next();
};

export { authSocket };
