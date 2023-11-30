import { response } from "@lib/resources/api-gateway";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { deleteTimeSheetRecords } from "src/utils/kimaiUtils";
import { queryDatabase } from "src/utils/notionUtils";

export const handler: APIGatewayProxyHandler = middy(
  async (event: APIGatewayProxyEvent): Promise<any> => {
    try {
      console.log({ event });
      let payload: any = event.body;
      const notionDatabases = {
        PRODUCTIVITY_TRACKER: process.env.NOTION_DB_PRODUCTIVITY_TRACKER,
        KIMAI_TOKENS: process.env.NOTION_DB_KIMAI_TOKENS,
        NOTION_DB_TEAM_DIRECTORY: process.env.NOTION_DB_TEAM_DIRECTORY,
      };
      const userTokenDetails = await queryDatabase(
        notionDatabases.KIMAI_TOKENS,
        ["Name", "Email", "API token", "Activity Id", "Project Id"]
      );

      const user = userTokenDetails.filter(
        (el: any) => el?.email?.toLowerCase() === payload?.email?.toLowerCase()
      );

      if (user?.length && payload?.kimaiIds?.length) {
        for (let i = 0; i < payload.kimaiIds.length; i++) {
          const kimaiId = payload.kimaiIds[i];
          await deleteTimeSheetRecords({
            email: user[0].email,
            authToken: user[0].apiToken,
            recordId: kimaiId,
          });
        }
      }

      return response(200, {
        message: "Deleted SuccessFully",
      });
    } catch (error) {
      console.error(error);
      return response(400, {
        error: JSON.stringify(error),
        message: error?.message,
      });
    }
  }
).use([jsonBodyParser()]);
