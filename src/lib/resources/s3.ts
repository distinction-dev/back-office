import env from "@lib/env";
import { Endpoint, S3 } from "aws-sdk";

const s3 = new S3({
  apiVersion: "latest",
  ...(env.STAGE === "local" && {
    s3ForcePathStyle: true,
    endpoint: new Endpoint("http://localhost:4569"),
  }),
});

export const getPreSignedUrl = async (
  methodType: string,
  bucketName: string,
  key: string
) => {
  return await s3.getSignedUrlPromise(methodType, {
    Bucket: bucketName,
    Key: key,
    Expires: 900,
  });
};

export const uploadFile = async (
  bucketName: string,
  key: string,
  data: Buffer
) => {
  return await s3
    .upload({
      Bucket: bucketName,
      Key: key,
      Body: data,
    })
    .promise();
};

export const getFile = async (bucketName: string, key: string) => {
  return await s3
    .getObject({
      Bucket: bucketName,
      Key: key,
    })
    .promise();
};
