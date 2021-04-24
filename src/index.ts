import { YC } from "./yc";
import { preSignedUrl } from "./s3-pre-sign-for-func";

module.exports.handler = async function (event: YC.CloudFunctionsHttpEvent) {
  const { httpMethod, queryStringParameters } = event;

  if (httpMethod != "GET")
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        errMsg: "Используйте метод GET для получения картинки",
      }),
      isBase64Encoded: false,
    };

  const mustHaveParams = ["inpPictName"];
  if (!mustHaveParams.every((element) => queryStringParameters[element]))
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        errMsg: "Вы не передали один из обязательных параметров : inpPictName",
      }),
      isBase64Encoded: false,
    };

  const preSignedUrlResult = await preSignedUrl(
    queryStringParameters.inpPictName
  );
  const outMsg = {
    preSignedUrl: preSignedUrlResult,
  };

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },

    body: JSON.stringify(outMsg),
    isBase64Encoded: false,
  };
};
