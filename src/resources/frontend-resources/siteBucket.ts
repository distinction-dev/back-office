import { AWSS3Bucket } from "serverless-schema";
import { BucketNames } from "../constants";

export const BackOfficeSiteBucket: AWSS3Bucket = {
  Type: "AWS::S3::Bucket",
  Properties: {
    BucketName: BucketNames.FrontEndBuildBucket,
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
          AllowedMethods: ["GET"],
          AllowedOrigins: ["*"],
        },
      ],
    },
    WebsiteConfiguration: {
      IndexDocument: "index.html",
    },
  },
};
