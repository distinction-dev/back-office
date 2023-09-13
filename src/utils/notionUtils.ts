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
  filter?: any,
  sorts?: any
) => {
  const dbResponse = await notion.databases.query({
    database_id: databaseId,
    filter,
    sorts,
  });

  const result = [];

  for (const record of dbResponse.results) {
    if (record.object === "database" || record.object === "page") {
      let outputObject = {
        rowId: record.id,
      };
      filterProperties.forEach((property) => {
        const cameliseKey = camelCase(property);
        if (record?.properties[property]?.type === "select") {
          outputObject[cameliseKey] = record.properties[property]?.select?.name;
        } else if (record?.properties[property]?.type === "rich_text") {
          outputObject[cameliseKey] =
            record.properties[property]?.rich_text[0]?.plain_text;
        } else if (record?.properties[property]?.type === "title") {
          outputObject[cameliseKey] =
            record.properties[property]?.title[0]?.plain_text;
        } else if (record?.properties[property]?.type === "relation") {
          outputObject[cameliseKey] =
            record.properties[property]?.relation[0]?.id;
        } else if (record?.properties[property]?.type === "email") {
          outputObject[cameliseKey] = record.properties[property]?.email;
        } else if (record?.properties[property]?.type === "date") {
          outputObject[cameliseKey] = record.properties[property]?.date?.start;
        } else if (record?.properties[property]?.type === "last_edited_by") {
          outputObject[cameliseKey] =
            record.properties[property]?.last_edited_by?.id;
        } else if (record?.properties[property]?.type === "number") {
          outputObject[cameliseKey] = record.properties[property]?.number;
        } else if (record?.properties[property]?.type === "last_edited_time") {
          outputObject[cameliseKey] =
            record.properties[property]?.last_edited_time;
        } else {
          outputObject[cameliseKey] = record.properties[property];
        }
      });
      result.push(outputObject);
    }
  }

  return result;
};

export const getDDevUserNames = async () => {
  return await queryDatabase(process.env.NOTION_DB_TEAM_DIRECTORY, ["Name"]);
};
