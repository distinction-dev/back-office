import { AWSDynamoDBTable } from "serverless-schema";
import { DynamoDBTableNames } from "./constants";

export const dynamoResources: AWSDynamoDBTable = {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: DynamoDBTableNames.BackOfficeTimeSheetTableName,
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
      StreamSpecification: {
        StreamViewType: "NEW_AND_OLD_IMAGES",
      },
    },
};
