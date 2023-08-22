/* eslint-disable max-len */
import { AwsFunctions } from "serverless-schema";

export const kimaiEntryFunctions: AwsFunctions = {
  kimaiScheduler: {
    handler: "src/handlers/kimaiScheduler.syncNotionDataToKimai",
    timeout: 500,
    memorySize: 512,
    events: [
      {
        schedule: "cron(0 0 ? * WED,SUN *)",
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
  },
};
