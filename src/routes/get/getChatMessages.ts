import express, { Request, Response, Router } from "express";

import { prisma } from "../../core/prisma/prisma";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { GetErrors } from "../../core/errors/getErrors";
import { authToken } from "../../core/auth/auth";
import { IMessage } from "core/data/interfaces";

const getChatMessages: Router = express.Router();

getChatMessages.get("/", authToken, async (req: Request, res: Response) => {
  // Get query param
  const { userFor } = req.query;
  const { uuid } = req.user;

  // If it is not a string, then we return an error
  if (typeof userFor !== "string") {
    return res
      .status(GetErrors.anItemIsNotAString().details.errorCode)
      .send(GetErrors.anItemIsNotAString());
  }

  // Set an array of items to check
  let arr: string[] = [userFor];

  // Verifying the data inputted from the user
  if (!verifyArray(arr)) {
    return res
      .status(GetErrors.getUserDidNotProvideDetails().details.errorCode)
      .send(GetErrors.getUserDidNotProvideDetails());
  }

  // Get the data of a user
  let chatUuid = await prisma.chat.findMany({
    where: {
      OR: [
        {
          AND: [
            {
              user_one: uuid,
            },
            {
              user_two: userFor,
            },
          ],
        },
        {
          AND: [
            {
              user_one: userFor,
            },
            {
              user_two: uuid,
            },
          ],
        },
      ],
    },
  });

  if (chatUuid.length === 0) {
    return res
      .status(GetErrors.getChatDoesNotExist().details.errorCode)
      .send(GetErrors.getChatDoesNotExist());
  }

  const messages = await prisma.message.findMany({
    where: {
      chat_relation: chatUuid[0].chat_uuid,
    },
  });

  const filteredList: IMessage[] = [];

  for (let i = 0; i < messages.length; i++) {
    filteredList.push({
      message_uuid: messages[i].message_uuid,
      chat_relation: messages[i].chat_relation,
      author: messages[i].author,
      to: messages[i].to,
      creatiom_time: messages[i].creatiom_time.toString(),
      message: messages[i].message,
    });
  }

  return res.send(filteredList);
});

export default getChatMessages;
