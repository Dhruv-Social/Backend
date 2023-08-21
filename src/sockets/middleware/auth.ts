import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { verifyRefreshToken } from "../../core/jwt/jwt";
import { decryptTokenRefresh } from "../../core/jwt/jwt";

const authSocket = async (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void
) => {
  let token = socket.handshake.auth.token;

  // Verify token
  if (!(await verifyRefreshToken(token))) {
    return next(new Error("Invalid Session Token"));
  }

  let tokenData;

  try {
    tokenData = decryptTokenRefresh(token);
  } catch (err) {
    return next(new Error("Invalid Session Token"));
  }

  socket.uuid = tokenData.uuid;

  next();
};

export { authSocket };
