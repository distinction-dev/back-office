import { readFile } from "node:fs/promises";
import { APIGatewayEvent, APIGatewayProxyHandler } from "aws-lambda";

import {
  getCurrentDate,
  getWickesTimeSheetFileName,
  transformNotionDate,
} from "src/utils/dateUtils";
import constant from "src/utils/constant";
import { response } from "@lib/resources/api-gateway";
import { writeWickesCSVFile } from "src/utils/csvHandler";
import { queryDynamoDBTable } from "@lib/resources/dynamo";
import { getPreSignedUrl, uploadFile } from "@lib/resources/s3";
import { BucketNames, DynamoDBTableNames } from "src/resources/constants";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
): Promise<any> => {
  try {
    const requestBody: any = event.body;
    const parsedBody = JSON.parse(requestBody);

    const wickesUserNames = Object.keys(parsedBody);
    console.log({ wickesUserNames });

    let finalResult = [];

    for (const wickesUser of wickesUserNames) {
      const nameInArr = wickesUser.toUpperCase().split(" ");

      const tableResponse = await queryDynamoDBTable({
        TableName: DynamoDBTableNames.TimeSheetDynamoTable,
        IndexName: DynamoDBTableNames.CustomerDateIndex,
        KeyConditionExpression:
          "customer = :cust AND #date BETWEEN :startDate AND :endDate",
        FilterExpression: "#devName = :devName",
        ExpressionAttributeValues: {
          ":cust": constant.WICKES_CUSTOMER,
          ":startDate": "2023-10-01",
          ":endDate": getCurrentDate(),
          ":devName": wickesUser,
        },
        ExpressionAttributeNames: {
          "#date": "date",
          "#devName": "name",
        },
      });

      const userRecords = tableResponse.Items.map((record) => ({
        hours: constant.WORK_HOURS,
        description: record.description,
        ticket: parsedBody[wickesUser].ticket,
        customer: parsedBody[wickesUser].customer,
        date: transformNotionDate(record.date, "DD-MM-YYYY"),
        contact:
          nameInArr.length > 1
            ? nameInArr[0] + nameInArr[1].charAt(0)
            : nameInArr[0],
      }));

      finalResult = [...finalResult, ...userRecords];
    }

    const outFilePath = await writeWickesCSVFile(finalResult);

    const bufferData = await readFile(outFilePath);

    await uploadFile(
      BucketNames.BackOfficeTimeSheetBucket,
      getWickesTimeSheetFileName(),
      bufferData
    );

    return response(200, {
      url: await getPreSignedUrl(
        "getObject",
        BucketNames.BackOfficeTimeSheetBucket,
        getWickesTimeSheetFileName()
      ),
    });
  } catch (error) {
    console.error(error);
    return response(400, {
      message: error.message,
    });
  }
};
