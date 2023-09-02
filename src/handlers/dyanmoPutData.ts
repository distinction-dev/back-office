const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
import { DynamoDBTableNames } from "../resources/constants";
module.exports.populateData = async () => {
  // Fetch data from the notion API
  const apiData = await fetchDataFromAPI();

  // Insert data into DynamoDB
  for (const item of apiData) {
    await dynamoDB
      .put({
        TableName: DynamoDBTableNames.BackOfficeTimeSheetTableName,
        Item: item,
      })
      .promise();
  }
};
