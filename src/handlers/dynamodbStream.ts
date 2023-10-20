/* eslint-disable max-len */
import {
  getSingleItemDynamoDB,
  putSingleItemDynamoDB,
  updateItemDynamoDB,
} from "@lib/resources/dynamo";
import { DynamoDBTableNames } from "../resources/constants";
import { unmarshallOutput } from "@aws-sdk/lib-dynamodb/dist-types/commands/utils";
import * as dayjs from "dayjs";
// import { sendTimeSheetRecordToKimai } from "src/utils/kimaiUtils";

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

export const handler = async (event) => {
  for (const record of event.Records) {
    if (record.eventName === "MODIFY") {
      // Extract the updated item from the record
      const updatedItem = unmarshallOutput(record.dynamodb.NewImage, []);

      // Check if the date exists in the DynamoDB table for the editor
      const params = {
        TableName: DynamoDBTableNames.BackOfficeTimeSheetDynamoTable,
        Key: {
          name: updatedItem.name,
          dateTimestamp: dayjs(updatedItem.date, "YYYY-MM-DD").unix(),
        },
      };

      try {
        const existingItem = await getSingleItemDynamoDB(params);
        const { begin, end } = getStartEndTimeStrings(updatedItem.date, 10, 18);
        const kimaiRecord = {
          begin,
          end,
          name: updatedItem.name,
          email: updatedItem.email,
          authToken: updatedItem.apiToken,
          project: updatedItem.projectId,
          activity: updatedItem.activityId,
          description: updatedItem.description,
        };
        console.log("Kimai Record Body", kimaiRecord);
        // If the date does not exist, create a new record
        if (!existingItem.Item) {
          await putSingleItemDynamoDB({
            TableName: DynamoDBTableNames.BackOfficeTimeSheetDynamoTable,
            Item: updatedItem,
          });

          console.log(
            `Created new record for name: 
            ${updatedItem.name} and Date: ${updatedItem.date}`
          );

          // const kimaiResponse = await sendTimeSheetRecordToKimai(
          //   element.email,
          //   element.authToken,
          //   JSON.stringify(kimaiRecord)
          // );

          // console.log("Created - Kimai API Response", kimaiResponse);
        } else if (
          existingItem.Item.lastEditedTime !== updatedItem.lastEditedTime
        ) {
          // If the date exists but lastEditedTime is different, update the record
          await updateItemDynamoDB({
            TableName: DynamoDBTableNames.BackOfficeTimeSheetDynamoTable,
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
        } else {
          console.log(
            `No action needed for name: ${updatedItem.name} and Date: ${updatedItem.date}`
          );
        }
      } catch (error) {
        console.error("Error processing record:", error);
      }
    } else if (record.eventName === "CREATE") {
      // Extract the updated item from the record
      const createdItem = unmarshallOutput(record.dynamodb.NewImage, []);

      const { begin, end } = getStartEndTimeStrings(createdItem.date, 10, 18);
      const kimaiRecord = {
        begin,
        end,
        name: createdItem.name,
        email: createdItem.email,
        authToken: createdItem.apiToken,
        project: createdItem.projectId,
        activity: createdItem.activityId,
        description: createdItem.description,
      };
      console.log("Kimai Record Body", kimaiRecord);
      await putSingleItemDynamoDB({
        TableName: DynamoDBTableNames.BackOfficeTimeSheetDynamoTable,
        Item: createdItem,
      });
      console.log(
        `Created new record for name: ${createdItem.name} and Date: ${createdItem.date}`
      );

      // const kimaiResponse = await sendTimeSheetRecordToKimai(
      //   element.email,
      //   element.authToken,
      //   JSON.stringify(kimaiRecord)
      // );
      // console.log("Created - Kimai API Response", kimaiResponse);
      // Check if the date exists in the DynamoDB table for the editor
      const params = {
        TableName: DynamoDBTableNames.BackOfficeTimeSheetDynamoTable,
        Key: { name: createdItem.name, date: createdItem.date },
      };
      console.log(params);
    }
  }
};
