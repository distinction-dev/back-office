import fetch from "node-fetch";
import { getDDevUserNames, queryDatabase } from "./notionUtils";

const KIMAI_CLOUD_BASE_URL = "https://elevationservices.kimai.cloud/api";
const KIMAI_CLOUD_TIMESHEET_ENDPOINT = KIMAI_CLOUD_BASE_URL + "/timesheets";

export const sendTimeSheetRecordToKimai = async (
  email: string,
  authToken: string,
  record: string
) => {
  const response = await fetch(KIMAI_CLOUD_TIMESHEET_ENDPOINT, {
    headers: {
      "X-AUTH-USER": email,
      "X-AUTH-TOKEN": authToken,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    method: "POST",
    body: record,
  });

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
};

export const getDevsKimaiData = async (devName: string, databaseId: string) => {
  try {
    const ddevUsers = await getDDevUserNames();
    console.log({ ddevUsers });

    const findUserIndex = ddevUsers.findIndex(
      (item) => item.name?.trim() === devName?.trim()
    );

    if (findUserIndex === -1) {
      throw new Error("User name not found");
    }

    const findUserId = ddevUsers[findUserIndex].rowId;

    const devsKimaiData = await queryDatabase(
      databaseId,
      ["Name", "Email", "API token", "Activity Id", "Project Id", "User Name"],
      {
        property: "User Name",
        relation: {
          contains: findUserId,
        },
      }
    );

    return devsKimaiData[0];
  } catch (error) {
    console.error("Error while getting dev's kimai data", error, devName);
  }
};
