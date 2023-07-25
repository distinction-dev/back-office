import { Resources } from "serverless-schema";
import { BackOfficeTimesheetBucket } from "./s3";
import { ApiGatewayResource } from "./apiGateway";
import { BackOfficeSiteBucket } from "./frontend-resources/siteBucket";
import { CloudFrontDistribution } from "./frontend-resources/cloudfront";

export const BackOfficeResources: Resources = {
  ...ApiGatewayResource,
  BackOfficeSiteBucket,
  CloudFrontDistribution,
  BackOfficeTimesheetBucket,
};
