import { Resources } from "serverless-schema";
import { BackOfficeTimeSheetBucket } from "./s3";
import { ApiGatewayResource } from "./apiGateway";
import { SQSResources } from "./queues";
import { BackOfficeSiteBucket } from "./frontend-resources/siteBucket";
import { BackOfficeTimeSheetDynamoTable } from "./dynamoResources";
// import { CloudFrontDistribution } from "./frontend-resources/cloudfront";

export const BackOfficeResources: Resources = {
  ...ApiGatewayResource,
  BackOfficeSiteBucket,
  // CloudFrontDistribution,
  BackOfficeTimeSheetBucket,
  BackOfficeTimeSheetDynamoTable,
  ...SQSResources,
};
