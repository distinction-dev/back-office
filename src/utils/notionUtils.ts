import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_AUTH_TOKEN,
});

const camelCase = (str: string) => {
  let ans = str.toLowerCase();
  return ans
    .split(" ")
    .reduce((s, c) => s + (c.charAt(0).toUpperCase() + c.slice(1)));
};

export const queryDatabase = async (
  databaseId: string,
  filterProperties: string[],
  filter?: any
) => {
  const dbResponse = await notion.databases.query({
    database_id: databaseId,
    filter,
  });

  const result = [];

  for (const record of dbResponse.results) {
    if (record.object === "database") {
      let outputObject = {};
      filterProperties.forEach((property) => {
        const cameliseKey = camelCase(property);
        if (record.properties[property].type === "select") {
          outputObject[cameliseKey] = record.properties[property].select.name;
        } else if (record.properties[property].type === "rich_text") {
          outputObject[cameliseKey] =
            record.properties[property]?.rich_text[0]?.plain_text;
        } else if (record.properties[property].type === "title") {
          outputObject[cameliseKey] =
            record.properties[property]?.title[0]?.plain_text;
        } else if (record.properties[property].type === "relation") {
          outputObject[cameliseKey] =
            record.properties[property]?.relation[0]?.id;
        } else if (record.properties[property].type === "email") {
          outputObject[cameliseKey] = record.properties[property]?.email;
        } else if (record.properties[property].type === "date") {
          outputObject[cameliseKey] = record.properties[property]?.date?.start;
        } else {
          outputObject[cameliseKey] = record.properties[property];
        }
      });
      result.push(outputObject);
    }
  }

  return result;
};
