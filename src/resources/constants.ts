import env from "@lib/env";

export const BucketNames = {
  FrontEndBuildBucket: `back-office-site-${env.STAGE}`,
  BackOfficeTimeSheetBucket: `back-office-timesheet-${env.STAGE}`,
};
export const DynamoDBTableNames = {
  BackOfficeTimeSheetDynamoTable: `back-office-timesheet-${env.STAGE}`,
  TimeSheetDynamoTable: `timesheet-${env.STAGE}`,
  DateNameIndex: `name-date-index`,
  CustomerDateIndex: `customer-date-index`,
  CustomerNameDateCompIndex: `customer-name-date-comp-index`,
};

export const SQSQueueNames = {
  KimaiFailedQueue: `kimai_failed_entries_${env.STAGE}`,
};

export const FunctionArns = {
  // eslint-disable-next-line max-len
  generateWickesTimesheet: `arn:aws:lambda:ap-south-1:${env.AWS_ACCOUNT_ID}:function:${env.SERVICE_NAME}-${env.STAGE}-generateWickesTimesheet`,
};
