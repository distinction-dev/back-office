import { readFile } from "node:fs/promises";
import { APIGatewayEvent, APIGatewayProxyHandler } from "aws-lambda";

import constant from "src/utils/constant";
import { BucketNames } from "src/resources/constants";
import { response } from "@lib/resources/api-gateway";
import { writeWickesCSVFile } from "src/utils/csvHandler";
import { getPreSignedUrl, uploadFile } from "@lib/resources/s3";
import { getDDevUserNames, queryDatabase } from "src/utils/notionUtils";
import { getFirstDateOfMonth, transformNotionDate } from "src/utils/dateUtils";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
): Promise<any> => {
  try {
    const requestBody: any = event.body;
    const ddevUserNames = await getDDevUserNames();
    const parsedBody = JSON.parse(requestBody);
    const wickesUserNames = Object.keys(parsedBody);

    let finalResult = [];

    for (const wickeUser of wickesUserNames) {
      const nameInArr = wickeUser.toUpperCase().split(" ");

      const index = ddevUserNames.findIndex((user) => user.name === wickeUser);
      const records = await queryDatabase(
        process.env.NOTION_DB_PRODUCTIVITY_TRACKER,
        ["Date", "Description"],
        {
          and: [
            {
              property: "Name",
              relation: {
                contains: ddevUserNames[index].rowId,
              },
            },
            {
              property: "Date",
              date: {
                on_or_after: getFirstDateOfMonth(),
              },
            },
            {
              property: "Customer",
              select: {
                equals: constant.WICKES_CUSTOMER,
              },
            },
          ],
        },
        [
          {
            property: "Date",
            direction: "ascending",
          },
        ]
      );

      const modifiedRecords = records.map((record) => ({
        hours: constant.WORK_HOURS,
        description: record.description,
        ticket: parsedBody[wickeUser].ticket,
        customer: parsedBody[wickeUser].customer,
        date: transformNotionDate(record.date, "DD-MM-YYYY"),
        contact:
          nameInArr.length > 1
            ? nameInArr[0] + nameInArr[1].charAt(0)
            : nameInArr[0],
      }));

      finalResult = [...finalResult, ...modifiedRecords];
    }

    const outFilePath = await writeWickesCSVFile(finalResult);

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
