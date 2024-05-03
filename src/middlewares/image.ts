import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { RequestHandler } from "express";
import sharp from "sharp";
import { s3 } from "../routes/paper";

export const resizeImage: RequestHandler = async (req, res, next) => {
  try {
    const file = req.file as Express.MulterS3.File;
    if (!file) {
      return next();
    }

    const getObjectCommand = new GetObjectCommand({
      Bucket: file.bucket,
      Key: file.key,
    });

    const object = await s3.send(getObjectCommand);
    const sharpInput = await object.Body?.transformToByteArray();

    const Body = await sharp(sharpInput).resize({ width: 600 }).toFormat("webp").toBuffer();

    const putObjectCommand = new PutObjectCommand({
      Bucket: file.bucket,
      Key: file.key,
      Body,
    });

    s3.send(putObjectCommand);
    next();
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const deleteS3Image = async (location?: string) => {
  try {
    if (!location) {
      return;
    }
    const Key = location.split("/").at(-1);
    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: "vegwins",
      Key,
    });

    await s3.send(deleteObjectCommand);
  } catch (e) {
    console.error(e);
  }
};
