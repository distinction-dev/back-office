import {
  getTimesheetWickesDevs,
  generateWickesTimesheet,
  invokeWickesTimesheetFn,
} from "./timeSheetReport";
import { syncNotionToDynamo } from "./syncNotionToDynamo";
import { dynamodbStream } from "./dynamodbStream";
import { getKimaiEntriesList } from "./getKimaiEntriesList";
import { deleteKimaiEntries } from "./deleteKimaiEntries";

export const functions = {
  getTimesheetWickesDevs,
  generateWickesTimesheet,
  syncNotionToDynamo,
  dynamodbStream,
  invokeWickesTimesheetFn,
  getKimaiEntriesList,
  deleteKimaiEntries,
};
