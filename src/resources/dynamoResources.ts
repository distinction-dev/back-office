import { AWSDynamoDBTable } from "serverless-schema";
import { DynamoDBTableNames } from "./constants";

export const BackOfficeTimeSheetDynamoTable: AWSDynamoDBTable = {
  Type: "AWS::DynamoDB::Table",
  Properties: {
    TableName: DynamoDBTableNames.TimeSheetDynamoTable,
    AttributeDefinitions: [
      {
        AttributeName: "id",
        AttributeType: "S",
      },
      {
        AttributeName: "dateTimestamp",
        AttributeType: "S",
      },
      {
        AttributeName: "name",
        AttributeType: "S",
      },
      {
        AttributeName: "nameDateTimestamp",
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
        IndexName: DynamoDBTableNames.DateNameIndex,
        KeySchema: [
          {
            AttributeName: "name",
            KeyType: "HASH",
          },
          {
            AttributeName: "dateTimestamp",
            KeyType: "RANGE",
          },
        ],
        Projection: {
          ProjectionType: "ALL",
        },
      },
      {
        IndexName: DynamoDBTableNames.CustomerNameDateCompIndex,
        KeySchema: [
          {
            AttributeName: "customer",
            KeyType: "HASH",
          },
          {
            AttributeName: "nameDateTimestamp",
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
