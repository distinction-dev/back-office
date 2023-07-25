const fs = require("fs");
const moment = require("moment");
const { parse } = require("csv-parse");
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

export const getUserNames = async (csvFileBuffer: Buffer) => {
  const filePath = await writeFilePromise(
    `${constant.TEMP_PATH}/file.csv`,
    csvFileBuffer
  );
  return new Promise((resolve) => {
    const uniqueNames = new Set();
    fs.createReadStream(filePath)
      .pipe(parse({ delimiter: "," }))
      .on("data", function (csvrow: any[]) {
        if (csvrow[1] === "Wickes Consulting") {
          uniqueNames.add(csvrow[7]);
        }
      })
      .on("end", function () {
        const names = Array.from(uniqueNames);
        resolve(names);
      });
  });
};

export const writeFinalCSV = async (
  csvFileBuffer: Buffer | string,
  userJSONData: any
) => {
  const filePath = await writeFilePromise(
    `${constant.TEMP_PATH}/file.csv`,
    csvFileBuffer
  );
  return new Promise((resolve) => {
    const jsonData = {};
    fs.createReadStream(filePath)
      .pipe(parse({ delimiter: "," }))
      .on("data", function (csvrow: any[]) {
        if (csvrow[1] === "Wickes Consulting") {
          const key = csvrow[7];
          const nameArr = csvrow[7].toUpperCase().split(" ");
          if (!userJSONData[key]) {
            console.log(
              "key",
              key,
              userJSONData.keys(),
              userJSONData[key],
              userJSONData["Smit Pethani"]
            );
          }
          const recordObject = {
            date: moment(csvrow[0], "MMMM DD, YYYY").format("DD-MM-YYYY"),
            customer: userJSONData[key].customer,
            ticket: userJSONData[key].ticket,
            hours: "8:00",
            description: csvrow[5],
            contact: nameArr[0] + nameArr[1].charAt(0),
          };
          if (Array.isArray(jsonData[key])) {
            jsonData[key].push(recordObject);
          } else {
            jsonData[key] = [recordObject];
          }
        }
      })
      .on("end", async function () {
        let records = [];
        const userNames = Object.keys(jsonData);

        userNames.forEach((name) => {
          const userData = jsonData[name];
          userData.sort((a, b) =>
            moment(a.date, "DD-MM-YYYY").diff(moment(b.date, "DD-MM-YYYY"))
          );
          records = [...records, ...userData];
        });

        await csvWriter.writeRecords(records);

        resolve(`${constant.TEMP_PATH}/output.csv`);
      });
  });
};
