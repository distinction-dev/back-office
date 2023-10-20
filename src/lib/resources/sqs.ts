import {
  DeleteMessageCommand,
  DeleteMessageCommandInput,
  DeleteMessageCommandOutput,
  SQSClient,
  SendMessageBatchCommand,
  SendMessageBatchCommandInput,
  SendMessageBatchCommandOutput,
  SendMessageCommand,
  SendMessageCommandInput,
  SendMessageCommandOutput,
} from "@aws-sdk/client-sqs";

export const sqsClient = new SQSClient({
  apiVersion: "latest",
});

export const deleteSQSMessage = async (
  params: DeleteMessageCommandInput
): Promise<DeleteMessageCommandOutput> => {
  const deleteCommand: DeleteMessageCommand = new DeleteMessageCommand(params);
  return await sqsClient.send(deleteCommand);
};

export const sendSQSMessage = async (
  params: SendMessageCommandInput
): Promise<SendMessageCommandOutput> => {
  const sendCommand: SendMessageCommand = new SendMessageCommand(params);
  return await sqsClient.send(sendCommand);
};

export const sendBatchSQSMessage = async (
  params: SendMessageBatchCommandInput
): Promise<SendMessageBatchCommandOutput> => {
  const sendBatchCommand: SendMessageBatchCommand = new SendMessageBatchCommand(
    params
  );
  return await sqsClient.send(sendBatchCommand);
};
