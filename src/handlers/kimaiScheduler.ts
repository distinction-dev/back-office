/* eslint-disable no-unused-vars */
// import { sendTimeSheetRecordToKimai } from "src/utils/kimaiUtils";
import { queryDatabase } from "src/utils/notionUtils";

const ONMO_CUSTOMER = "Onmo Consulting";

const getStartEndTimeStrings = (
  date: string,
  start_hours: number,
  end_hours: number
) => {
  const startTime = new Date(date);
  startTime.setHours(start_hours);
  const endTime = new Date(date);
  endTime.setHours(end_hours);
  return {
    begin: startTime.toISOString().slice(0, -5),
    end: endTime.toISOString().slice(0, -5),
  };
};

const getFirstDateOfMonth = () => {
  const dt = new Date();
  dt.setDate(1);
  return dt.toISOString().slice(0, 10);
};

export const syncNotionDataToKimai = async () => {
  try {
    const onmoDevsKiamiData = await queryDatabase(
      process.env.NOTION_DB_KIMAI_TOKENS,
      ["Name", "Email", "API token", "Activity Id", "Project Id", "User Name"]
    );

    let results = [];

    for (const dev of onmoDevsKiamiData) {
      const timesheetRecords = await queryDatabase(
        process.env.NOTION_DB_PRODUCTIVITY_TRACKER,
        ["Date", "Description"],
        {
          and: [
            {
              property: "Name",
              relation: {
                contains: dev.userName,
              },
            },
            {
              property: "Date",
              date: {
                on_or_after: getFirstDateOfMonth(),
              },
            },
            {
              property: "Customer",
              select: {
                equals: ONMO_CUSTOMER,
              },
            },
          ],
        }
      );

      const modifiedRecords = timesheetRecords.map((record) => {
        const { begin, end } = getStartEndTimeStrings(record.date, 10, 18);
        return {
          begin,
          end,
          name: dev.name,
          email: dev.email,
          authToken: dev.apiToken,
          project: dev.projectId,
          activity: dev.activityId,
          description: record.description,
        };
      });

      results = [...results, ...modifiedRecords];
    }

    // Send Data To Kimai Example
    // const myObj = results[results.length - 1];
    // const body = JSON.stringify({
    //   begin: myObj.begin,
    //   end: myObj.end,
    //   project: myObj.project,
    //   activity: myObj.activity,
    //   description: myObj.description,
    // });

    // const kimaiResponse = await sendTimeSheetRecordToKimai(
    //   myObj.email,
    //   myObj.authToken,
    //   body
    // );

    console.log(JSON.stringify(results));
  } catch (error) {
    console.error(error);
  }
};
