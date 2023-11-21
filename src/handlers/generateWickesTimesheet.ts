import { readFile } from "fs/promises";
import { APIGatewayProxyHandler } from "aws-lambda";

import {
  getCurrentDate,
  getFirstDateOfMonth,
  getWickesTimeSheetFileName,
  transformNotionDate,
} from "src/utils/dateUtils";
import constant from "src/utils/constant";
import { response } from "@lib/resources/api-gateway";
import { writeWickesCSVFile } from "src/utils/csvHandler";
import { queryDynamoDBTable } from "@lib/resources/dynamo";
import { getPreSignedUrl, uploadFile } from "@lib/resources/s3";
import { BucketNames, DynamoDBTableNames } from "src/resources/constants";
import { sendEmailWithAttachment } from "@lib/resources/ses";

export const handler: APIGatewayProxyHandler = async (
  event: any
): Promise<any> => {
  try {
    console.log("Event ", event);

    const parsedBody = event;

    const emailDestinationAddress = parsedBody.emailDestination;
    const wickesUserData = parsedBody.form;
    const wickesUserNames = Object.keys(parsedBody.form);
    console.log({ wickesUserNames, emailDestinationAddress });

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
          ":startDate": getFirstDateOfMonth(),
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
        ticket: wickesUserData[wickesUser].ticket,
        customer: wickesUserData[wickesUser].customer,
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

    await sendEmailWithAttachment(
      emailDestinationAddress,
      outFilePath,
      "Wickes Timesheet",
      ""
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
