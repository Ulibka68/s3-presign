require("dotenv").config();
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

import { createReadStream, statSync } from "fs";
import { PutObjectCommandInput } from "@aws-sdk/client-s3/commands/PutObjectCommand";

export const preSignedUrl = async (pictName) => {
  try {
    // Create an Amazon S3 service client object.
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_ENDPOINT,
      apiVersion: "latest",
      // credentials: { accessKeyId: process.env.AWS_KEY, secretAccessKey: process.env.AWS_SECRET },
      // credential автоматически грузится из .env
    });

    // Create the command.
    // Set parameters
    // Create a random names for the Amazon Simple Storage Service (Amazon S3) bucket and key
    const params: PutObjectCommandInput = {
      Bucket: process.env.TMPBACKETNAME,
      Key: pictName,
      ContentType: "image",
      // Body: "BODY",
    };

    const command = new PutObjectCommand(params);

    // Create the presigned URL.
    const signedUrl: string = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return signedUrl;
  } catch (err) {
    console.log("Error creating presigned URL", err);
    return "";
  }
};
