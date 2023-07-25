import { readFile } from "node:fs/promises";
import { writeFinalCSV } from "src/utils/csvHandler";
import { response } from "@lib/resources/api-gateway";
import { BucketNames } from "src/resources/constants";
import { APIGatewayEvent, APIGatewayProxyHandler } from "aws-lambda";
import { getFile, getPreSignedUrl, uploadFile } from "@lib/resources/s3";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
): Promise<any> => {
  try {
    const requestBody = event.body;

    const inputFile = await getFile(
      BucketNames.BackOfficeTimeSheetBucket,
      "upload/file.csv"
    );

    const outFilePath = await writeFinalCSV(
      inputFile.Body,
      JSON.parse(requestBody)
    );

    const bufferData = await readFile(outFilePath);

    await uploadFile(
      BucketNames.BackOfficeTimeSheetBucket,
      "output/file.csv",
      bufferData
    );

    return response(200, {
      url: await getPreSignedUrl(
        "getObject",
        BucketNames.BackOfficeTimeSheetBucket,
        "output/file.csv"
      ),
    });
  } catch (error) {
    console.error(error);
    return response(400, {
      message: error.message,
    });
  }
};
