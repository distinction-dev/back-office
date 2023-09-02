import { timeSheetUploadCSV, timeSheetUploadUserData } from "./timeSheetReport";
import { kimaiScheduler, dyanmoPutData } from "./kimaiEntry";
import { dynamodbStream } from "./dynamodbStream";

export const functions = {
  timeSheetUploadCSV,
  timeSheetUploadUserData,
  kimaiScheduler,
  dyanmoPutData,
  dynamodbStream,
};
