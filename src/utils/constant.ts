import env from "@lib/env";

export default {
  TEMP_PATH: env.STAGE === "local" ? "./tmp" : "/tmp",
  ONMO_CUSTOMER: "Onmo Consulting",
  WICKES_CUSTOMER: "Wickes Consulting",
  WORK_HOURS: "8:00",
};
