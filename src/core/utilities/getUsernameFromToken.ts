import { decryptTokenRefresh } from "../jwt/jwt";
import { prisma } from "../prisma/prisma";

const getUsername = async (token: string) => {
  let payload = decryptTokenRefresh(token);

  let prismaReturn = await prisma.user.findUnique({
    where: {
      uuid: payload.uuid,
    },
    select: {
      username: true,
    },
  });

  if (prismaReturn === null) {
    throw new Error("Unexpected Type null");
  }

  return prismaReturn.username;
};

export { getUsername };
