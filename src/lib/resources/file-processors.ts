import * as csv from "csv-parser";
import { createObjectCsvWriter, createArrayCsvWriter } from "csv-writer";
import * as fs from "fs";

/**
 * Use this class for reading csv files.
 */
export class CSVProcessor {
  parser: any;
  /**
   * reads the csv file specified by filepath parameter.
   * @param {String} filePath path to the csv file.
   */
  constructor(filePath: string) {
    const stream = fs.createReadStream(filePath);
    this.parser = csv();
    stream.pipe(this.parser);
  }

  /**
   * Use this method to read header names from a csv file specified
   * @returns Array of strings containing column header names
   */
  getHeaders() {
    return new Promise((resolve) => {
      this.parser.on("headers", (headers) => {
        resolve(headers);
      });
    });
  }

  /**
   * Use this method to read data from a csv file specified
   * @param {CustomReadingOptions} [options]
   * @returns {Promise<any[]>} Array of object containing column headers
   * as keys, and data as value.
   */
  read(options = { trimStrings: false }) {
    /**
     * @type {any[]}
     */
    let results: any = [];
    return new Promise((resolve) => {
      this.parser.on("data", (data: any) => results.push(data));
      this.parser.on("end", () => {
        results = results.map((row) => {
          for (const key of Object.keys(row)) {
            if (options.trimStrings && typeof row[key] === "string") {
              row[key] = row[key].trim();
            }
          }
          return row;
        });
        resolve(results);
      });
    });
  }

  /**
   * this is csv write method which will write csv file at given filePath
   * @param {String} filePath this is file path which also includes file name
   * and extension
   * @param {{ id: string; title: string }[] | String[]} headers this is headers
   * for csv data which can be keys of json data or key with title that we want
   * @param {Object[]} data this is json data that we wanna convert to csv
   *  this can be array of object that
   */
  static async write(filePath: string, headers: any, data: any) {
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: headers,
    });
    await csvWriter.writeRecords(data);
  }
}
/**
 * this is csv write method which will write csv file at given filePath
 * @param {String} filePath this is file path which also includes file name
 * and extension
 * @param {any[]} data this is array data that we wanna convert to csv
 */
export const CSVFromArray = async (filePath: string, data: any) => {
  const arrayData = data.map((item: any) => [item]);
  const csvWriter = createArrayCsvWriter({
    path: filePath,
  });
  await csvWriter.writeRecords(arrayData);
};
