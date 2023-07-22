import { AwsFunction } from "serverless-schema";

export const helloFunction: AwsFunction = {
  handler: "src/handlers/hello.handler",
  events: [
    {
      http: {
        method: "GET",
        path: "api/hello",
      },
    },
  ],
};
