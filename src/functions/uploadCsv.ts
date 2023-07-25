import { uploadFile } from "@lib/resources/s3";
import { getUserNames } from "src/utils/csvHandler";
import { response } from "@lib/resources/api-gateway";
import { BucketNames } from "src/resources/constants";
import * as multipart from "aws-lambda-multipart-parser";
import { APIGatewayEvent, APIGatewayProxyHandler } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
): Promise<any> => {
  const result = multipart.parse(event, true);

  const names = await getUserNames(result.file.content);

  await uploadFile(
    BucketNames.BackOfficeTimeSheetBucket,
    "upload/file.csv",
    result.file.content
  );

  return response(200, {
    message: "Inside upload csv",
    names,
  });
};
