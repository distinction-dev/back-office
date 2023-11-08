import { APIGatewayProxyHandler } from "aws-lambda";

import constant from "src/utils/constant";
import { DynamoDBTableNames } from "src/resources/constants";
import { response } from "@lib/resources/api-gateway";
import { queryDynamoDBTable } from "@lib/resources/dynamo";
import { onlyUnique, polishData } from "src/utils/arrayUtils";
import { getCurrentDate } from "src/utils/dateUtils";

export const handler: APIGatewayProxyHandler = async (): Promise<any> => {
  try {
    const wickesUserRecords = await queryDynamoDBTable({
      TableName: DynamoDBTableNames.TimeSheetDynamoTable,
      IndexName: DynamoDBTableNames.CustomerDateIndex,
      KeyConditionExpression:
        "customer = :cust AND #date BETWEEN :startDate AND :endDate",
      ExpressionAttributeValues: {
        ":cust": constant.WICKES_CUSTOMER,
        ":startDate": "2023-10-01",
        ":endDate": getCurrentDate(),
      },
      ExpressionAttributeNames: {
        "#date": "date",
      },
    });

    const wickesUserNames = wickesUserRecords.Items.map((item) => item.name);

    const uniqueNameListWickes = wickesUserNames
      .filter(onlyUnique)
      .filter(polishData);

    console.log("uniqueNameListWickes", uniqueNameListWickes);

    response(200, {
      names: uniqueNameListWickes,
    });
  } catch (error) {
    console.error(error);
    return response(400, {
      message: error.message,
    });
  }
};
