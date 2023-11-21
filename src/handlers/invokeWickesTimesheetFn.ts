import {
  LambdaClient,
  InvokeCommand,
  InvocationType,
} from "@aws-sdk/client-lambda";
import { APIGatewayEvent, APIGatewayProxyHandler } from "aws-lambda";

import { response } from "@lib/resources/api-gateway";
import { FunctionArns } from "src/resources/constants";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
) => {
  // Create an instance of the Lambda service
  const region = process.env.AWS_REGION || "ap-south-1";
  const lambda = new LambdaClient({ region });

  const params = {
    FunctionName: FunctionArns.generateWickesTimesheet,
    InvocationType: "Event" as InvocationType,
    Payload: JSON.stringify(event.body),
  };

  try {
    const data = await lambda.send(new InvokeCommand(params));
    console.log(
      "Successfully triggered the generateWickesTimesheet Lambda function:",
      data
    );

    return response(200, {
      message:
        "Successfully triggered the generateWickesTimesheet Lambda function",
    });
  } catch (error) {
    console.error(
      "Error triggering the generateWickesTimesheet Lambda function:",
      error
    );
    return response(400, {
      message: error.message,
    });
  }
};
