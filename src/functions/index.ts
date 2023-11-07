import { timeSheetUploadCSV, timeSheetUploadUserData } from "./timeSheetReport";
import { syncNotionToDynamo } from "./syncNotionToDynamo";
import { dynamodbStream } from "./dynamodbStream";

export const functions = {
  timeSheetUploadCSV,
  timeSheetUploadUserData,
  syncNotionToDynamo,
  dynamodbStream,
};
