import { APIGatewayProxyHandler } from "aws-lambda";
import { response } from "@lib/resources/api-gateway";

import constant from "src/utils/constant";
import { getFirstDateOfMonth } from "src/utils/dateUtils";
import { onlyUnique, polishData } from "src/utils/arrayUtils";
import { getDDevUserNames, queryDatabase } from "src/utils/notionUtils";

export const handler: APIGatewayProxyHandler = async (): Promise<any> => {
  try {
    const ddevUsersNames = await getDDevUserNames();

    const wickesRecordsNameIds = await queryDatabase(
      process.env.NOTION_DB_PRODUCTIVITY_TRACKER,
      ["Name"],
      {
        and: [
          {
            property: "Date",
            date: {
              on_or_after: getFirstDateOfMonth(),
            },
          },
          {
            property: "Customer",
            select: {
              equals: constant.WICKES_CUSTOMER,
            },
          },
        ],
      }
    );

    const uniqueNameIds = wickesRecordsNameIds
      .map((item) => item.name)
      .filter(onlyUnique)
      .filter(polishData);

    const names = uniqueNameIds.map((item) => {
      const index = ddevUsersNames.findIndex((user) => user.rowId === item);
      if (index !== -1) return ddevUsersNames[index].name;
    });

    return response(200, {
      message: "Inside upload csv",
      names,
    });
  } catch (error) {
    console.error(error);
    return response(400, {
      message: error.message,
    });
  }
};
