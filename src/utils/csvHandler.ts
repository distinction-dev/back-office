const fs = require("fs");
import { createObjectCsvWriter } from "csv-writer";

import constant from "./constant";

export const writeFilePromise = async (
  path: string,
  data: Buffer | string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err: any) => {
      if (err) reject(err);
      resolve(path);
    });
  });
};

export const writeWickesCSVFile = async (records: any[]) => {
  const csvWriter = createObjectCsvWriter({
    path: `${constant.TEMP_PATH}/output.csv`,
    header: [
      { id: "date", title: "Date" },
      { id: "customer", title: "Customer" },
      { id: "ticket", title: "Ticket" },
      { id: "hours", title: "Hours" },
      { id: "description", title: "Description" },
      { id: "contact", title: "Contact" },
    ],
  });
  await csvWriter.writeRecords(records);
  return `${constant.TEMP_PATH}/output.csv`;
};
