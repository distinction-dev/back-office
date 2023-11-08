import env from "@lib/env";

export default {
  TEMP_PATH: env.STAGE === "local" ? "./tmp" : "/tmp",
  TEMPLATES_DIRECTORY: "./src/assets/email_templates",
  ONMO_CUSTOMER: "Onmo Consulting",
  WICKES_CUSTOMER: "Wickes Consulting",
  WORK_HOURS: "8:00",
  EMAIL_TEMPLATE: {
    SEND_DOCUMENT: "send_document",
  },
};
