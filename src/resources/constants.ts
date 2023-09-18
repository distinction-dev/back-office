import env from "@lib/env";

export const BucketNames = {
  FrontEndBuildBucket: `back-office-site-${env.STAGE}`,
  BackOfficeTimeSheetBucket: `back-office-timesheet-${env.STAGE}`,
};
export const DynamoDBTableNames = {
  BackOfficeTimeSheetDynamoTable: `back-office-timesheet-${env.STAGE}`,
};
