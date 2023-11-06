import { v4 as uuid } from "uuid";
import { DynamoDBStreamEvent } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { sendBatchSQSMessage } from "@lib/resources/sqs";

import {
  getDevsKimaiData,
  sendTimeSheetRecordToKimai,
  getKimaiRecordStartEndTimeStrings,
} from "src/utils/kimaiUtils";

export const handler = async (event: DynamoDBStreamEvent) => {
  const failedKimaiEntries = [];
  try {
    console.log({ event });
    for (const record of event.Records) {
      console.log("Record", { record });
      console.log("Record.dynamodb.NewImage", {
        data: unmarshall(record.dynamodb.NewImage as any),
      });

      if (record.eventName === "INSERT") {
        // Extract the updated item from the record
        const createdItem = unmarshall(record.dynamodb.NewImage as any);

        console.log("Created Item", { createdItem });

        if (createdItem.customer === "Onmo Consulting") {
          const { begin, end } = getKimaiRecordStartEndTimeStrings(
            createdItem.date,
            10,
            18
          );

          const devsKimaiData = await getDevsKimaiData(
            createdItem.name?.trim(),
            process.env.NOTION_DB_KIMAI_TOKENS
          );

          console.log("Kimai Data of developer", { devsKimaiData });

          const kimaiBody = JSON.stringify({
            begin,
            end,
            description: "",
            project: devsKimaiData.projectId?.toString()?.trim(),
            activity: devsKimaiData.activityId?.toString()?.trim(),
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
