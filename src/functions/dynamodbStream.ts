import { AwsFunction } from "serverless-schema";

export const dynamodbStream: AwsFunction = {
  handler: "src/handlers/dynamodbStream.handler",
  timeout: 500,
  memorySize: 512,
  events: [
    {
      stream: {
        type: "dynamodb",
        arn: {
          "Fn::GetAtt": ["BackOfficeTimeSheetDynamoTable", "StreamArn"],
        },
      },
    },
  ],
};