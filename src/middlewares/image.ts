import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { RequestHandler } from "express";
import multer from "multer";
import s3Storage from "multer-s3";
import sharp from "sharp";

export const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_ACCESS_SECRET || "",
  },
  region: "ap-northeast-2",
});

export const upload = multer({
  storage: s3Storage({
    s3,
    bucket: "vegwins",
    key(req, file, callback) {
      callback(null, `${Date.now()}_${file.originalname}`);
    },
  }),
  limits: { fieldSize: 5 * 1024 * 1024 },
});

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
