/* eslint-disable max-len */
import { AwsFunction } from "serverless-schema";

export const timeSheetUploadCSV: AwsFunction = {
  handler: "src/handlers/uploadCsv.handler",
  events: [
    {
      http: {
        method: "POST",
        path: "/api/uploadCSV",
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
  },
};
export const timeSheetUploadUserData: AwsFunction = {
  handler: "src/handlers/uploadUserData.handler",
  events: [
    {
      http: {
        method: "POST",
        path: "/api/uploadUserData",
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
  },
};
