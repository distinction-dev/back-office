import { AwsFunction } from "serverless-schema";

export const dynamodbStream: AwsFunction = {
  handler: "src/handlers/dynamodbStream.handler",
  timeout: 500,
  memorySize: 512,
  environment: {
    FAILED_KIMAI_ENTRIES_SQS_URL:
      "${self:custom.notion.sync.failedKimaiSQSUrl}",
    NOTION_DB_KIMAI_TOKENS:
      "${self:custom.notion.NOTION_DB_KIMAI_TOKENS.${self:custom.stage}}",
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
