/* Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
Purpose:
s3_put_presignedURL.ts creates a presigned URL to upload a file to an Amazon Simple Storage Service (Amazon S3) bucket.

Note: This example immediately deletes the object and bucket.

Inputs (replace in code):
- REGION


Running the code:
ts-node s3_put_presignedURL.ts
[Outputs | Returns]:
Uploads the specified file to the specified bucket.
*/
import { S3Client } from "@aws-sdk/client-s3";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SIGN1 {
  const {
    S3,
    CreateBucketCommand,
    DeleteObjectCommand,
    PutObjectCommand,
    DeleteBucketCommand,
  } = require("@aws-sdk/client-s3");
  const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

  // Create an Amazon S3 service client object.
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT,
    apiVersion: "latest",
    // credentials: { accessKeyId: process.env.AWS_KEY, secretAccessKey: process.env.AWS_SECRET },
    // credential автоматически грузится из .env
  });

  const run = async () => {
    try {
      // Create the command.
      // Set parameters
      // Create a random names for the Amazon Simple Storage Service (Amazon S3) bucket and key
      const params = {
        Bucket: process.env.TMPBACKETNAME,
        Key: `test-object1.jpg`,
        Body: "BODY",
      };

      const command = new PutObjectCommand(params);

      // Create the presigned URL.
      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
      });
      console.log(
        `\nPutting "${params.Key}" using signedUrl with body "${params.Body}" in v3`
      );
      console.log(signedUrl);
      // const response = await fetch(signedUrl);
      // console.log(
      //   `\nResponse returned by signed URL: ${await response.text()}\n`
      // );
    } catch (err) {
      console.log("Error creating presigned URL", err);
    }
  };
  run();
}
// snippet-end:[s3.JavaScript.buckets.presignedurlv3]

/*
ES6 Example
https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_s3_request_presigner.html

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
const client = new S3Client(clientParams);
const command = new GetObjectCommand(getObjectParams);
const url = await getSignedUrl(client, command, { expiresIn: 3600 });

Get Presigned URL from an Existing Request
ES6 Example:

import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { Sha256 } from "@aws-crypto/sha256-browser";
import { Hash } from "@aws-sdk/hash-node";
const signer = new S3RequestPresigner({
  region: regionProvider,
  credentials: credentialsProvider,
  sha256: Hash.bind(null, "sha256"), // In Node.js
  //sha256: Sha256 // In browsers
});
const presigned = await signer.presign(request);
 */

/*
https://stackoverflow.com/questions/62613331/how-to-get-signed-s3-url-in-aws-sdk-js-version-3

import { S3Client, GetObjectCommand, S3ClientConfig } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


const s3Configuration: S3ClientConfig = {
    credentials: {
        accessKeyId: '<ACCESS_KEY_ID>',
        secretAccessKey: '<SECRET_ACCESS_KEY>'
    },
    region: '<REGION>',
};
const s3 = new S3Client(s3Configuration);
const url = await getSignedUrl(s3, new GetObjectCommand({Bucket: '<BUCKET>', Key: '<KEY>' }), { expiresIn: 15 * 60 }); // expires in seconds
console.log('Presigned URL: ', url);
 */

/*
https://devopsglobalsolutions.com/aws-developer-blog/generate-a-presigned-url-in-modular-aws-sdk-for-javascript/

import fetch from "node-fetch";
import { createReadStream, statSync } from "fs";
//...
const payload = createReadStream(filePath);
const response = await fetch(presignedUrl, {
    method: "PUT",
    body: payload,
    headers: {
         "Content-Length": statSync(filePath).size
    }
});
 */

/*
Move Header to Query - запрос не выполнялся
https://github.com/aws/aws-sdk-js-v3/blob/master/packages/signature-v4/src/moveHeadersToQuery.ts#L13
 */
