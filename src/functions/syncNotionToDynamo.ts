/* eslint-disable max-len */

import env from "@lib/env";
import { AwsFunction } from "serverless-schema";

export const syncNotionToDynamo: AwsFunction = {
  handler: "src/handlers/syncNotionToDynamo.handler",
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
      schedule: {
        name: `notionSync-${env.STAGE}`,
        enabled: "${self:custom.notion.sync.mode}" as any,
        rate: "cron(* 0/12 * * ? *)",
      },
    },
  ],
};
