import {
  getTimesheetWickesDevs,
  generateWickesTimesheet,
} from "./timeSheetReport";
import { syncNotionToDynamo } from "./syncNotionToDynamo";
import { dynamodbStream } from "./dynamodbStream";

export const functions = {
  getTimesheetWickesDevs,
  generateWickesTimesheet,
  syncNotionToDynamo,
  dynamodbStream,
};
