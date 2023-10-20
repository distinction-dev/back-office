import env from "@lib/env";

export const BucketNames = {
  FrontEndBuildBucket: `back-office-site-${env.STAGE}`,
  BackOfficeTimeSheetBucket: `back-office-timesheet-${env.STAGE}`,
};
export const DynamoDBTableNames = {
  BackOfficeTimeSheetDynamoTable: `back-office-timesheet-${env.STAGE}`,
  TimeSheetDynamoTable: `timesheet-${env.STAGE}`,
  DateNameIndex: `name-date-index`,
  CustomerNameDateCompIndex: `customer-name-date-comp-index`,
};

export const SQSQueueNames = {
  KimaiFailedQueue: `kimai_failed_entries_${env.STAGE}`,
};
