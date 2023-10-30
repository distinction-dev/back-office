/* eslint-disable max-len */
import {
  putSingleItemDynamoDB,
  queryDynamoDBTable,
  updateItemDynamoDB,
} from "@lib/resources/dynamo";
import { DynamoDBTableNames } from "../resources/constants";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBStreamEvent } from "aws-lambda";
import { sendBatchSQSMessage } from "@lib/resources/sqs";
import { v4 as uuid } from "uuid";

import {
  sendTimeSheetRecordToKimai,
  getDevsKimaiData,
} from "src/utils/kimaiUtils";
import { QueryCommandInput } from "@aws-sdk/lib-dynamodb";

const getStartEndTimeStrings = (
  date: string,
  start_hours: number,
  end_hours: number
) => {
  const startTime = new Date(date);
  startTime.setHours(start_hours);
  const endTime = new Date(date);
  endTime.setHours(end_hours);
  return {
    begin: startTime.toISOString().slice(0, -5),
    end: endTime.toISOString().slice(0, -5),
  };
};

export const handler = async (event: DynamoDBStreamEvent) => {
  const failedKimaiEntries = [];
  try {
    console.log({ event });
    for (const record of event.Records) {
      console.log({ record });
      console.log({ data: unmarshall(record.dynamodb.NewImage as any) });
      if (record.eventName === "MODIFY") {
        // Extract the updated item from the record
        const updatedItem = unmarshall(record.dynamodb.NewImage as any);

        // Check if the date exists in the DynamoDB table for the editor
        const params: QueryCommandInput = {
          TableName: DynamoDBTableNames.TimeSheetDynamoTable,
          KeyConditionExpression: "id = :key",
          ExpressionAttributeValues: {
            ":key": updatedItem?.id,
          },
        };
        const existingItem = await queryDynamoDBTable(params);

        if (!existingItem.Items.length) {
          // If the date does not exist, create a new record
          try {
            await putSingleItemDynamoDB({
              TableName: DynamoDBTableNames.TimeSheetDynamoTable,
              Item: updatedItem,
            });

            console.log(
              `Created new record for name: 
            ${updatedItem.name} and Date: ${updatedItem.date}`
            );
          } catch (error) {
            console.log("Dynamo Error:", error);
          }
        } else if (
          existingItem.Items[0].lastEditedTime !== updatedItem.lastEditedTime
        ) {
          // If the date exists but lastEditedTime is different, update the record
          try {
            await updateItemDynamoDB({
              TableName: DynamoDBTableNames.TimeSheetDynamoTable,
              Key: {
                name: updatedItem.name,
                date: updatedItem.date,
              },
              UpdateExpression:
                "SET lastEditedTime = :time, description = :description",
              ExpressionAttributeValues: {
                ":time": updatedItem.lastEditedTime,
                ":description": updatedItem.description,
              },
            });
            console.log(
              `Updated record for name: ${updatedItem.name} and Date: ${updatedItem.date}`
            );
          } catch (error) {
            console.log("Dynamo Error:", error);
          }
        } else {
          console.log(
            `No action needed for name: ${updatedItem.name} and Date: ${updatedItem.date}`
          );
        }
      } else if (record.eventName === "INSERT") {
        // Extract the updated item from the record
        const createdItem = unmarshall(record.dynamodb.NewImage as any);

        console.log({ createdItem });

        if (createdItem.customer === "Onmo Consulting") {
          const { begin, end } = getStartEndTimeStrings(
            createdItem.date,
            10,
            18
          );

          const devsKimaiData = await getDevsKimaiData(
            createdItem.name?.trim(),
            process.env.NOTION_DB_KIMAI_TOKENS
          );
          console.log({ devsKimaiData });
          const kimaiBody = JSON.stringify({
            begin,
            end,
            project: devsKimaiData.projectId?.toString()?.trim(),
            activity: devsKimaiData.activityId?.toString()?.trim(),
            description: "",
          });
          console.log("Kimai Record Body", kimaiBody);

          if (devsKimaiData) {
            try {
              const kimaiResponse = await sendTimeSheetRecordToKimai(
                devsKimaiData.email?.trim(),
                devsKimaiData.apiToken?.trim(),
                kimaiBody
              );
              console.log("Kimai Response", kimaiResponse);
            } catch (error) {
              console.log("Kimai Error:", error);
              failedKimaiEntries.push({
                email: devsKimaiData.email?.trim(),
                apiToken: devsKimaiData.apiToken?.trim(),
                body: JSON.stringify(kimaiBody),
              });
            }
          }
        }

        await putSingleItemDynamoDB({
          TableName: DynamoDBTableNames.TimeSheetDynamoTable,
          Item: createdItem,
        });
        console.log(
          `Created new record for name: ${createdItem.name} and Date: ${createdItem.date}`
        );

        // Check if the date exists in the DynamoDB table for the editor
        const params = {
          TableName: DynamoDBTableNames.TimeSheetDynamoTable,
          Key: { name: createdItem.name, date: createdItem.date },
        };
        console.log(params);
      }
    }
  } catch (error) {
    console.log("Error:", error);
    if (failedKimaiEntries.length) {
      await sendBatchSQSMessage({
        QueueUrl: process.env.FAILED_KIMAI_ENTRIES_SQS_URL,
        Entries: failedKimaiEntries.map((el: any) => {
          return {
            Id: uuid(),
            MessageBody: el,
          };
        }),
      });
    }
  }
};
