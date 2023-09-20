import { AWSDynamoDBTable } from "serverless-schema";
import { DynamoDBTableNames } from "./constants";

export const BackOfficeTimeSheetDynamoTable: AWSDynamoDBTable = {
  Type: "AWS::DynamoDB::Table",
  Properties: {
    TableName: DynamoDBTableNames.BackOfficeTimeSheetDynamoTable,
    AttributeDefinitions: [
      {
        AttributeName: "id",
        AttributeType: "S",
      },
      {
        AttributeName: "date",
        AttributeType: "S",
      },
      {
        AttributeName: "name",
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
    GlobalSecondaryIndexes: [
      {
        IndexName: "DateNameIndex",
        KeySchema: [
          {
            AttributeName: "date",
            KeyType: "HASH",
          },
          {
            AttributeName: "name",
            KeyType: "RANGE",
          },
        ],
        Projection: {
          ProjectionType: "ALL",
        },
      },
    ],
  },
};
