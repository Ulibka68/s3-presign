import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
require("dotenv").config();
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

import fetch from "node-fetch";
import { createReadStream, statSync } from "fs";
import { PutObjectCommandInput } from "@aws-sdk/client-s3/commands/PutObjectCommand";

const run = async () => {
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
      Key: `test-object1.jpg`,
      ContentType: "image/pjpeg",
      // Body: "BODY",
    };

    const command = new PutObjectCommand(params);

    // Create the presigned URL.
    const signedUrl: string = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    console.log(`\nPutting "${params.Key}" using signedUrl with body in v3`);
    console.log(signedUrl.length);
    console.log(signedUrl);

    const filePath =
      "/root/_prj/yandex/s3-presign/assets/1920x1200_1400379_ArtFile.jpg";
    const payload = createReadStream(filePath);
    const response = await fetch(signedUrl, {
      method: "PUT",
      body: payload,
      headers: {
        "Content-Length": statSync(filePath).size,
        "Content-Type": "image",
      },
    });
    // console.log(response);
  } catch (err) {
    console.log("Error creating presigned URL", err);
  }
};
run();
