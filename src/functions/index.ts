import { TimeSheetFunctions } from "./timeSheetReport";
import { kimaiEntryFunctions } from "./kimaiEntry";
export const functions = {
  ...TimeSheetFunctions,
  ...kimaiEntryFunctions,
};
