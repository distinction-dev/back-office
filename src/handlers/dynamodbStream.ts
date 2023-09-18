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
        TableName: DynamoDBTableNames.BackOfficeTimeSheetDynamoTable,
        Key: { name: updatedItem.name, date: updatedItem.date },
      };

      try {
        const existingItem = await dynamoDB.get(params).promise();

        // If the date does not exist, create a new record
        if (!existingItem.Item) {
          await dynamoDB
            .put({
              TableName: DynamoDBTableNames.BackOfficeTimeSheetDynamoTable,
              Item: updatedItem,
            })
            .promise();
          console.log(
            `Created new record for name: 
            ${updatedItem.name} and Date: ${updatedItem.date}`
          );
        } else if (
          existingItem.Item.lastEditedTime !== updatedItem.lastEditedTime
        ) {
          // If the date exists but lastEditedTime is different, update the record
          await dynamoDB
            .update({
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
            })
            .promise();
          console.log(
            `Updated record for name: ${updatedItem.name} 
            and Date: ${updatedItem.date}`
          );
        } else {
          console.log(
            `No action needed for name: ${updatedItem.name} 
            and Date: ${updatedItem.date}`
          );
        }
      } catch (error) {
        console.error("Error processing record:", error);
      }
    }
  }
};
