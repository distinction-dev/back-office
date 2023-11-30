import { response } from "@lib/resources/api-gateway";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { getTimeSheetRecords } from "src/utils/kimaiUtils";
import { queryDatabase } from "src/utils/notionUtils";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<any> => {
  try {
    console.log({ event });
    const notionDatabases = {
      PRODUCTIVITY_TRACKER: process.env.NOTION_DB_PRODUCTIVITY_TRACKER,
      KIMAI_TOKENS: process.env.NOTION_DB_KIMAI_TOKENS,
      NOTION_DB_TEAM_DIRECTORY: process.env.NOTION_DB_TEAM_DIRECTORY,
    };
    const devData = {};
    const userTokenDetails = await queryDatabase(notionDatabases.KIMAI_TOKENS, [
      "Name",
      "Email",
      "API token",
      "Activity Id",
      "Project Id",
    ]);

    console.log("Kimai Entries count for November Month\n");
    for (const user of userTokenDetails) {
      const kimaiRecords = await getTimeSheetRecords({
        email: user.email,
        authToken: user.apiToken,
      });

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const filteredData = kimaiRecords.filter((item: any) => {
        const beginDate = new Date(item.begin);
        return beginDate.getMonth() === currentMonth;
      });
      console.log("User :", user.name);
      devData[user.name] = {
        total: filteredData.length,
      };
      console.log("Found records : ", filteredData.length);

      for (const record of filteredData) {
        console.log(
          "Record Id and begin date",
          record.id,
          record.begin.slice(0, 10)
        );
        // await deleteTimeSheetRecords(user.email,user.apiToken,record.id)
        // console.log("Deleted Record",record.id)

        console.log("--------------");
      }
      console.log("\n");
    }
    return response(200, {
      data: devData,
    });
  } catch (error) {
    return response(400, {
      error: JSON.stringify(error),
      message: error?.message,
    });
  }
};
