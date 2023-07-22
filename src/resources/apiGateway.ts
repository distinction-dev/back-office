import env from "@lib/env";
import { Resources } from "serverless-schema";

export const ApiGatewayResource: Resources = {
  BackOfficeApiGateway: {
    Type: "AWS::ApiGateway::RestApi",
    Properties: {
      Name: `back-office-${env.STAGE}`,
    },
  },
  GatewayAuthorizerResponses: {
    Type: "AWS::ApiGateway::GatewayResponse",
    Properties: {
      ResponseParameters: {
        "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
        "gatewayresponse.header.Access-Control-Allow-Headers": "'*'",
        "gatewayresponse.header.Access-Control-Allow-Methods":
          "'GET,OPTIONS,POST,PUT'",
      },
      ResponseType: "ACCESS_DENIED",
      ResponseTemplates: {
        "application/json": '{"message":"$context.stringKey"}',
      },
      RestApiId: {
        Ref: "BackOfficeApiGateway",
      },
    },
  },
  GatewayDenyResponses: {
    Type: "AWS::ApiGateway::GatewayResponse",
    Properties: {
      ResponseParameters: {
        "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
        "gatewayresponse.header.Access-Control-Allow-Headers": "'*'",
        "gatewayresponse.header.Access-Control-Allow-Methods":
          "'GET,OPTIONS,POST,PUT'",
      },
      ResponseType: "DEFAULT_4XX",
      ResponseTemplates: {
        "application/json": '{"message":"$context.stringKey"}',
      },
      RestApiId: {
        Ref: "BackOfficeApiGateway",
      },
    },
  },
  GatewayErrorResponses: {
    Type: "AWS::ApiGateway::GatewayResponse",
    Properties: {
      ResponseParameters: {
        "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
        "gatewayresponse.header.Access-Control-Allow-Headers": "'*'",
        "gatewayresponse.header.Access-Control-Allow-Methods":
          "'GET,OPTIONS,POST,PUT'",
      },
      ResponseType: "DEFAULT_5XX",
      RestApiId: {
        Ref: "BackOfficeApiGateway",
      },
    },
  },
};
