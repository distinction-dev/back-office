import { functions } from "@functions/index";
import env from "@lib/env";
import { ServerlessFrameworkConfiguration } from "serverless-schema";
import { BackOfficeResources } from "src/resources";

const serverlessConfiguration: ServerlessFrameworkConfiguration = {
  service: env.SERVICE_NAME,
  useDotenv: true,
  custom: {
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
    },
    stage: env.STAGE,
    stages: ["stage", "prod"],
    prune: {
      automatic: true,
      number: 3,
    },
    notion: {
      NOTION_AUTH_TOKEN: {
        prod: "${ssm:/back-office/notion/authToken/prod}",
        stage: "${ssm:/back-office/notion/authToken/stage}",
        local: "",
      },
      NOTION_DB_KIMAI_TOKENS: {
        prod: "${ssm:/back-office/notion/kimaiDb/prod}",
        stage: "${ssm:/back-office/notion/kimaiDb/stage}",
        local: "",
      },
      NOTION_DB_PRODUCTIVITY_TRACKER: {
        prod: "${ssm:/back-office/notion/prodTrackerDb/prod}",
        stage: "${ssm:/back-office/notion/prodTrackerDb/stage}",
        local: "",
      },
      NOTION_DB_TEAM_DIRECTORY: {
        prod: "${ssm:/back-office/notion/teamDirectoryDb/prod}",
        stage: "${ssm:/back-office/notion/teamDirectoryDb/stage}",
        local: "",
      },
    },
    // cloudfrontInvalidate: [
    //   {
    //     distributionIdKey: "CloudFrontDistributionId",
    //     autoInvalidate: true,
    //     items: ["/*"],
    //   },
    // ],
    /* Enable this */
    // s3: {
    //   host: "localhost",
    //   directory: "./buckets",
    // },
    /* In Local */
  },
  plugins: [
    "serverless-esbuild",
    "serverless-prune-plugin",
    // "serverless-cloudfront-invalidate",
    /* Enable this */
    // "serverless-s3-local",
    /* In Local */
    "serverless-offline",
  ],
  provider: {
    name: "aws",
    timeout: 30,
    runtime: "nodejs16.x",
    region: "ap-south-1",
    stage: env.STAGE,
    environment: {
      ...env,
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    },
    deploymentBucket: {
      name: "back-office-deployment-bucket",
      maxPreviousDeploymentArtifacts: 1,
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      metrics: false,
      restApiId:
        "${self:resources.Outputs.BackOfficeApiGatewayRestApiId.Value}",
      restApiRootResourceId:
        "${self:resources.Outputs.BackOfficeApiGatewayRootResourceId.Value}",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListObject",
          "s3:DeleteObject",
          "s3:CopyObject",
        ],
        Resource: [
          // eslint-disable-next-line max-len
          "${self:resources.Outputs.BackOfficeTimeSheetBucketResourceArn.Value}",
        ],
      },
    ],
  },
  package: {
    individually: true,
  },
  functions,
  resources: {
    Resources: BackOfficeResources,
    Outputs: {
      BackOfficeApiGatewayRestApiId: {
        Value: {
          "Fn::GetAtt": ["BackOfficeApiGateway", "RestApiId"],
        },
        Export: {
          Name: `BackOfficeApiGatewayRestApiId-${env.STAGE}`,
        },
      },
      BackOfficeApiGatewayRootResourceId: {
        Value: {
          "Fn::GetAtt": ["BackOfficeApiGateway", "RootResourceId"],
        },
        Export: {
          Name: `BackOfficeApiGatewayRootResourceId-${env.STAGE}`,
        },
      },
      BackOfficeTimeSheetBucket: {
        Value: {
          "Fn::GetAtt": ["BackOfficeTimeSheetBucket", "Arn"],
        },
        Export: {
          Name: `BackOfficeTimeSheetBucket-${env.STAGE}`,
        },
      },
      BackOfficeTimeSheetBucketResourceArn: {
        Value: {
          "Fn::Join": [
            "",
            [{ "Fn::GetAtt": ["BackOfficeTimeSheetBucket", "Arn"] }, "/*"],
          ],
        },
        Export: {
          Name: `BackOfficeTimeSheetBucketResourceArn-${env.STAGE}`,
        },
      },
      // CloudFrontDistributionId: {
      //   Description: "CloudFrontDistribution distribution id.",
      //   Value: {
      //     Ref: "CloudFrontDistribution",
      //   },
      // },
    },
  },
};

module.exports = serverlessConfiguration;
