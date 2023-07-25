import { AWSS3Bucket } from "serverless-schema";
import { BucketNames } from "./constants";

export const BackOfficeTimesheetBucket: AWSS3Bucket = {
  Type: "AWS::S3::Bucket",
  Properties: {
    BucketName: BucketNames.BackOfficeTimeSheetBucket,
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: false,
    },
    OwnershipControls: {
      Rules: [
        {
          ObjectOwnership: "ObjectWriter",
        },
      ],
    },
    CorsConfiguration: {
      CorsRules: [
        {
          AllowedMethods: ["GET", "PUT", "POST"],
          AllowedOrigins: ["*"],
        },
      ],
    },
  },
};
