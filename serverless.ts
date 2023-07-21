import { functions } from "@functions/index";
import env from "@lib/env";
import { ServerlessFrameworkConfiguration } from "serverless-schema";

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
    /* Enable this */
    // "serverless-s3-local",
    /* In Local */
    "serverless-offline",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    region: "us-west-1",
    stage: env.STAGE,
    environment: {
      ...env,
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    },
    deploymentBucket: {
      name: "back-office-deployment-bucket",
      maxPreviousDeploymentArtifacts: 1,
    },
    iamRoleStatements: [],
  },
  functions,
  package: {
    individually: true,
  },
};

module.exports = serverlessConfiguration;
