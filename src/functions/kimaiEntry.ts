/* eslint-disable max-len */

import { AwsFunction } from "serverless-schema";

export const dyanmoPutData: AwsFunction = {
  handler: "src/handlers/dyanmoPutData.handler",
  timeout: 500,
  memorySize: 512,
  environment: {
    NOTION_AUTH_TOKEN:
      "${self:custom.notion.NOTION_AUTH_TOKEN.${self:custom.stage}}",
    NOTION_DB_KIMAI_TOKENS:
      "${self:custom.notion.NOTION_DB_KIMAI_TOKENS.${self:custom.stage}}",
    NOTION_DB_PRODUCTIVITY_TRACKER:
      "${self:custom.notion.NOTION_DB_PRODUCTIVITY_TRACKER.${self:custom.stage}}",
    NOTION_DB_TEAM_DIRECTORY:
      "${self:custom.notion.NOTION_DB_TEAM_DIRECTORY.${self:custom.stage}}",
  },
};

export const kimaiScheduler: AwsFunction = {
  handler: "src/handlers/kimaiScheduler.syncNotionDataToKimai",
  timeout: 500,
  memorySize: 512,
  environment: {
    NOTION_AUTH_TOKEN:
      "${self:custom.notion.NOTION_AUTH_TOKEN.${self:custom.stage}}",
    NOTION_DB_KIMAI_TOKENS:
      "${self:custom.notion.NOTION_DB_KIMAI_TOKENS.${self:custom.stage}}",
    NOTION_DB_PRODUCTIVITY_TRACKER:
      "${self:custom.notion.NOTION_DB_PRODUCTIVITY_TRACKER.${self:custom.stage}}",
    NOTION_DB_TEAM_DIRECTORY:
      "${self:custom.notion.NOTION_DB_TEAM_DIRECTORY.${self:custom.stage}}",
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
