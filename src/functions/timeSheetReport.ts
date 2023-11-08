/* eslint-disable max-len */
import { AwsFunction } from "serverless-schema";

export const getTimesheetWickesDevs: AwsFunction = {
  handler: "src/handlers/getTimesheetWickesDevs.handler",
  events: [
    {
      http: {
        method: "POST",
        path: "/api/getTimesheetWickesDevs",
        cors: true,
      },
    },
  ],
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

export const generateWickesTimesheet: AwsFunction = {
  handler: "src/handlers/generateWickesTimesheet.handler",
  events: [
    {
      http: {
        method: "POST",
        path: "/api/generateWickesTimesheet",
        cors: true,
      },
    },
  ],
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
