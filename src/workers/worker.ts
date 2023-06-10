import { expose } from "threads/worker";
import { prisma } from "../core/prisma/prisma";
import { User } from "@prisma/client";

const SECONDS_IN_ONE_HOUR = 3_600 * 1_000;

expose(async function deleteUsers() {
  await deleteUsersFromTable();
  setInterval(async () => {
    await deleteUsersFromTable();
  }, SECONDS_IN_ONE_HOUR);
});

async function deleteUsersFromTable() {
  const users = await prisma.user.findMany({
    where: {
      verified: false,
    },
  });

  users.map(async (user: User) => {
    const userCreated = parseInt(user.creationDate.toString());
    if (!isUserWithinHour(userCreated)) {
      await prisma.user.delete({
        where: {
          uuid: user.uuid,
        },
      });
    }
  });
}

function isUserWithinHour(userCreated: number): boolean {
  const now = Date.now();
  const diffInMS = now - userCreated;
  const msInHour = Math.floor(diffInMS / 1000 / 60);

  if (msInHour > 60) {
    return false;
  }

  return true;
}
