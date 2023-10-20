/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import { putSingleItemDynamoDB } from "@lib/resources/dynamo";
import { DynamoDBTableNames } from "../resources/constants";
import { queryDatabase, getDDevUserNames } from "src/utils/notionUtils";
import dayjs from "dayjs";

const getFirstDateOfMonth = () => {
  const dt = new Date();
  dt.setDate(1);
  return dt.toISOString().slice(0, 10);
};

const fetchNotionData = async () => {
  try {
    const ddevUserNames = await getDDevUserNames();

    let finalResult: Array<NotionRecord> = [];

    for (const ddevUser of ddevUserNames) {
      const records = await queryDatabase(
        process.env.NOTION_DB_PRODUCTIVITY_TRACKER,
        [
          "Date",
          "Description",
          "Customer",
          "Created By",
          "Last edited by",
          "Stress Meter",
          "Created Time",
          "Last edited time",
        ],
        {
          and: [
            {
              property: "Name",
              relation: {
                contains: ddevUser.rowId,
              },
            },
            {
              property: "Date",
              date: {
                on_or_after: getFirstDateOfMonth(),
              },
            },
          ],
        }
      );

      const modifiedRecords = records.map((record) => ({
        name: ddevUser.name,
        dateTimestamp: `${dayjs(record.date, "YYYY-MM-DD").unix()}`,
        nameDateTimestamp: `${dayjs(record.date, "YYYY-MM-DD").unix()}_${
          ddevUser.name
        }`,
        id: record.rowId,
        ...record,
      }));

      finalResult = [...finalResult, ...modifiedRecords];
    }

    return finalResult;
  } catch (error) {
    console.error(error);
  }
};

interface NotionRecord {
  name: string;
  rowId: string;
  date: string; //Format -> yyyy-mm-dd
  dateTimestamp: Date;
  description: string;
  customer: string;
  lastEditedBy: string; // user id
  stressMeter: number;
  lastEditedTime: string; // timestamp -> 2023-09-12T06:55:00.000Z
}

// const exampleRecord: notionRecord = {
//   name: "Biki das",
//   rowId: "6f9825e1-8fb1-4fc7-b030-a9c03df8c5d4",
//   date: "2023-09-12",
//   description:
//     "Continue Developing The POC for (OAT-97), implementing the State of default active and Readonly",
//   customer: "Onmo Consulting",
//   lastEditedBy: "5c2d5ca2-50f2-4bb0-b54e-34f928371bb7",
//   stressMeter: 9,
//   lastEditedTime: "2023-09-12T06:55:00.000Z",
// };

export const handler = async () => {
  try {
    // Fetch data from the notion API
    const apiData: Array<NotionRecord> = await fetchNotionData();
    console.log({ apiData });
    // Insert data into DynamoDB
    for (const item of apiData) {
      await putSingleItemDynamoDB({
        TableName: DynamoDBTableNames.TimeSheetDynamoTable,
        Item: { ...item },
      });
    }
  } catch (error) {
    console.error(error);
  }
};
