import fetch from "node-fetch";

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
