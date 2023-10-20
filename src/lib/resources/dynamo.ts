import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  GetCommandOutput,
  PutCommand,
  PutCommandInput,
  PutCommandOutput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  UpdateCommand,
  UpdateCommandInput,
  UpdateCommandOutput,
} from "@aws-sdk/lib-dynamodb";

export const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "eu-west-1",
  apiVersion: "latest",
});

export const documentClient = DynamoDBDocumentClient.from(client);

export const getSingleItemDynamoDB = async (
  params: GetCommandInput
): Promise<GetCommandOutput> => {
  return await documentClient.send(new GetCommand(params));
};

export const scanDynamoDBTable = async (
  params: ScanCommandInput
): Promise<ScanCommandOutput> => {
  return await documentClient.send(new ScanCommand(params));
};

export const queryDynamoDBTable = async (
  params: QueryCommandInput
): Promise<QueryCommandOutput> => {
  return await documentClient.send(new QueryCommand(params));
};

export async function paginateQueryResults(queryParams: QueryCommandInput) {
  let allItems: any[] = [];
  let condition = true;
  while (condition) {
    const response = await queryDynamoDBTable(queryParams);

    const items = response.Items;
    allItems.push(...items);

    if (response.LastEvaluatedKey) {
      queryParams.ExclusiveStartKey = response.LastEvaluatedKey;
    } else {
      break;
    }
  }
  return allItems;
}

export async function paginateScanResults(scanParams: ScanCommandInput) {
  let allItems = [];
  let condition = true;

  while (condition) {
    const response = await scanDynamoDBTable(scanParams);

    const items = response.Items;
    allItems = allItems.concat(items);

    if (response.LastEvaluatedKey) {
      scanParams.ExclusiveStartKey = response.LastEvaluatedKey;
    } else {
      break;
    }
  }
  return allItems;
}

export const putSingleItemDynamoDB = async (
  params: PutCommandInput
): Promise<PutCommandOutput> => {
  return await documentClient.send(new PutCommand(params));
};

export const updateItemDynamoDB = async (
  params: UpdateCommandInput
): Promise<UpdateCommandOutput> => {
  return await documentClient.send(new UpdateCommand(params));
};
