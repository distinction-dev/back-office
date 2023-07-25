import { helloFunction } from "./hello";
import { TimeSheetFunctions } from "./timeSheetReport";

export const functions = {
  helloFunction,
  ...TimeSheetFunctions,
};
