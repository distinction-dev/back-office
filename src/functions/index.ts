import { helloFunction } from "./hello";

export const functions = {
  helloFunction,
  uploadCSV: {
    handler: "src/functions/uploadCsv.handler",
    events: [
      {
        http: {
          method: "POST",
          path: "/uploadCSV",
          cors: true,
        },
      },
    ],
  },
  uploadUserData: {
    handler: "src/functions/uploadUserData.handler",
    events: [
      {
        http: {
          method: "POST",
          path: "/uploadUserData",
          cors: true,
        },
      },
    ],
  },
};
