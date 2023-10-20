import { AwsFunction } from "serverless-schema";

export const dynamodbStream: AwsFunction = {
  handler: "src/handlers/dynamodbStream.handler",
  timeout: 500,
  memorySize: 512,
  environment: {
    FAILED_KIMAI_ENTRIES_SQS_URL:
      "${self:custom.notion.sync.failedKimaiSQSUrl}",
  },
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
