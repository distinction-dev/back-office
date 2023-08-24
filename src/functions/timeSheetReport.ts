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
};
