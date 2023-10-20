/* eslint-disable no-unused-vars */
import { sendTimeSheetRecordToKimai } from "src/utils/kimaiUtils";
import { response } from "@lib/resources/api-gateway";
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
    let total = {};

    for (const dev of onmoDevsKiamiData) {
      if (!dev?.userName) {
        console.error("Dev has not added user name", dev);
        continue;
      }
      console.log({ userName: dev, date: getFirstDateOfMonth() });
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
        total[dev.name] = 0;
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

    let count = 0;
    for (let i = 0; i < results.length; i++) {
      const element = results[i];
      console.log({ element });

      const body = JSON.stringify({
        begin: element.begin,
        end: element.end,
        project: element.project,
        activity: element.activity,
        description: element.description,
      });

      try {
        const kimaiResponse = await sendTimeSheetRecordToKimai(
          element.email,
          element.authToken,
          body
        );
        if (kimaiResponse) {
          count += 1;
          total[element.name] += 1;
        }
      } catch (error) {
        console.error("-".repeat(20));
        console.error("KIMAI API ERROR");
        console.error(error);
        console.error("-".repeat(20));
      }
    }
    console.log({ totalEntries: results.length });
    console.log({ count });
    console.log("-".repeat(10));
    console.log(total);
    console.log("-".repeat(10));
  } catch (error) {
    console.error(error);
    response(500, {
      error: JSON.stringify(error),
      message: error?.message,
    });
  }
};
