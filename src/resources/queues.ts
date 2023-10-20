import { Resources } from "serverless-schema";
import { SQSQueueNames } from "./constants";

export const SQSResources: Resources = {
  KimaiFailedEntriesQueue: {
    Type: "AWS::SQS::Queue",
    Properties: {
      QueueName: SQSQueueNames.KimaiFailedQueue,
    },
  },
};
