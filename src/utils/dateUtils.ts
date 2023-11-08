const moment = require("moment");

export const getFirstDateOfMonth = () => {
  const dt = new Date();
  dt.setDate(1);
  return dt.toISOString().slice(0, 10);
};

export const getCurrentDate = () => {
  const dt = new Date();
  return dt.toISOString().slice(0, 10);
};

export const transformNotionDate = (notionDate: string, format: string) => {
  return moment(notionDate, "YYYY-MM-DD").format(format);
};

export const getWickesTimeSheetFileName = () => {
  return "wickes_timesheet_" + moment().format("DD_MM_YYYY") + ".csv";
};
