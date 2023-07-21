import { AwsFunction } from "serverless-schema";

export const helloFunction: AwsFunction = {
  handler: "src/functions/hello.handler",
};
