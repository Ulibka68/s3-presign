const AWS = require("aws-sdk");
AWS.config.update({
  region: "ru-central1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: "https://storage.yandexcloud.net",
});
const s3 = new AWS.S3();

exports.handler = async (event, context) => {
  const result = await getUploadURL(s3);
  return {
    statusCode: 200,
    body: JSON.stringify({
      result,
      event,
      context,
      message: event.body,
    }),
  };
};

exports.handler2 = async (event, context) => {
  const result = await getUploadURL(s3);
  return {
    statusCode: 200,
    body: JSON.stringify({
      result,
      event,
      context,
      message: event.body,
    }),
  };
};
