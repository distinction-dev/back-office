import { timeSheetUploadCSV, timeSheetUploadUserData } from "./timeSheetReport";
import { kimaiScheduler, syncNotionToDynamo } from "./kimaiEntry";
import { dynamodbStream } from "./dynamodbStream";

export const functions = {
  timeSheetUploadCSV,
  timeSheetUploadUserData,
  kimaiScheduler,
  syncNotionToDynamo,
  dynamodbStream,
};
