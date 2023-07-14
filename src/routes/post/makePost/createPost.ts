import express, { Request, Response, Router } from "express";
import crypto from "crypto";
import fileUpload from "express-fileupload";

import { Post } from "@prisma/client";
import { verifyArray } from "../../../core/verifyArray/verifyArray";
import { PostErrors } from "../../../core/errors/errors";
import { authToken } from "../../../core/auth/auth";
import { prisma } from "../../../core/prisma/prisma";

const createPost: Router = express.Router();

// Reminder to get the post UUID from the token
createPost.post(
  "/",
  authToken,
  fileUpload(),
  async (req: Request | any, res: Response) => {
    const { text } = req.body;
    const { uuid } = req.user;

    let media1: string, media2: string, media3: string, media4: string;

    try {
      media1 = req.files.media1.data.toString("base64");
    } catch (err: any) {
      media1 = "null";
    }

    try {
      media2 = req.files.media2.data.toString("base64");
    } catch (err: any) {
      media2 = "null";
    }

    try {
      media3 = req.files.media3.data.toString("base64");
    } catch (err: any) {
      media3 = "null";
    }

    try {
      media4 = req.files.media4.data.toString("base64");
    } catch (err: any) {
      media4 = "null";
    }

    const media: string[] = [media1, media2, media3, media4];

    let arr: string[] = [text];

    if (!verifyArray(arr)) {
      return res
        .status(PostErrors.postUserInvalidDetails().details.errorCode)
        .send(PostErrors.postUserInvalidDetails());
    }

    const userData = await prisma.user.findUnique({
      where: {
        uuid: uuid,
      },
      select: {
        username: true,
        display_name: true,
      },
    });

    if (userData === null) {
      return;
    }

    const post: Post = {
      post_uuid: crypto.randomUUID(),
      author_uuid: uuid,
      author_display_name: userData.display_name,
      author_username: userData.username,
      likes: [],
      comments: [],
      text: text,
      media: media,
    };

    await prisma.user.update({
      data: {
        posts: {
          push: post.post_uuid,
        },
      },
      where: {
        uuid: post.author_uuid,
      },
    });

    await prisma.post.create({
      data: {
        post_uuid: post.post_uuid,
        author_uuid: post.author_uuid,
        author_display_name: post.author_display_name,
        author_username: post.author_username,
        likes: post.likes,
        comments: post.comments,
        text: post.text,
        media: post.media,
      },
    });

    return res.send("success!");
  }
);

export default createPost;
