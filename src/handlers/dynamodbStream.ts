/* eslint-disable max-len */
const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
import { DynamoDBTableNames } from "../resources/constants";
module.exports.updateRecords = async (event) => {
  for (const record of event.Records) {
    if (record.eventName === "MODIFY") {
      // Extract the updated item from the record
      const updatedItem = AWS.DynamoDB.Converter.unmarshall(
        record.dynamodb.NewImage
      );

      // Check if the date exists in the DynamoDB table for the editor
      const params = {
        TableName: DynamoDBTableNames.BackOfficeTimeSheetTableName,
        Key: { Editorname: updatedItem.Editorname, date: updatedItem.date },
      };

      try {
        const existingItem = await dynamoDB.get(params).promise();

        // If the date does not exist, create a new record
        if (!existingItem.Item) {
          await dynamoDB
            .put({
              TableName: DynamoDBTableNames.BackOfficeTimeSheetTableName,
              Item: updatedItem,
            })
            .promise();
          console.log(
            `Created new record for Editorname: 
            ${updatedItem.Editorname} and Date: ${updatedItem.date}`
          );
        } else if (
          existingItem.Item.lastUpdateTime !== updatedItem.lastUpdateTime
        ) {
          // If the date exists but lastUpdateTime is different, update the record
          await dynamoDB
            .update({
              TableName: DynamoDBTableNames.BackOfficeTimeSheetTableName,
              Key: {
                Editorname: updatedItem.Editorname,
                date: updatedItem.date,
              },
              UpdateExpression: "SET lastUpdateTime = :time, text = :text",
              ExpressionAttributeValues: {
                ":time": updatedItem.lastUpdateTime,
                ":text": updatedItem.text,
              },
            })
            .promise();
          console.log(
            `Updated record for Editorname: ${updatedItem.Editorname} 
            and Date: ${updatedItem.date}`
          );
        } else {
          console.log(
            `No action needed for Editorname: ${updatedItem.Editorname} 
            and Date: ${updatedItem.date}`
          );
        }
      } catch (error) {
        console.error("Error processing record:", error);
      }
    }
  }
};
