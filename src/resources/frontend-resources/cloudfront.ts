import { AWSCloudFrontDistribution } from "serverless-schema";
import { BucketNames } from "../constants";

export const CloudFrontDistribution: AWSCloudFrontDistribution = {
  Type: "AWS::CloudFront::Distribution",
  Properties: {
    DistributionConfig: {
      Origins: [
        {
          DomainName: `${BucketNames.FrontEndBuildBucket}.s3.amazonaws.com`,
          Id: "BackOfficeFrontend",
          CustomOriginConfig: {
            HTTPPort: 80,
            HTTPSPort: 443,
            OriginProtocolPolicy: "https-only",
          },
        },
      ],
      Enabled: true,
      DefaultRootObject: "index.html",
      CustomErrorResponses: [
        {
          ErrorCode: 404,
          ResponseCode: 200,
          ResponsePagePath: "/index.html",
        },
      ],
      DefaultCacheBehavior: {
        AllowedMethods: [
          "DELETE",
          "GET",
          "HEAD",
          "OPTIONS",
          "PATCH",
          "POST",
          "PUT",
        ],
        TargetOriginId: "BackOfficeFrontend",
        ForwardedValues: {
          QueryString: false,
          Cookies: {
            Forward: "none",
          },
        },
        ViewerProtocolPolicy: "redirect-to-https",
      },
      ViewerCertificate: {
        CloudFrontDefaultCertificate: true,
      },
    },
  },
};
