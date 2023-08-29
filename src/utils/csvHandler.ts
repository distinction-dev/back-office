const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

import constant from "./constant";

const csvWriter = createCsvWriter({
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
  await csvWriter.writeRecords(records);
  return `${constant.TEMP_PATH}/output.csv`;
};
