export const TimeSheetFunctions = {
  uploadCSV: {
    handler: "src/handlers/uploadCsv.handler",
    events: [
      {
        http: {
          method: "POST",
          path: "/api/uploadCSV",
        },
      },
    ],
  },
  uploadUserData: {
    handler: "src/handlers/uploadUserData.handler",
    events: [
      {
        http: {
          method: "POST",
          path: "/api/uploadUserData",
        },
      },
    ],
  },
};
