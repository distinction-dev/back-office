import env from "@lib/env";

export default {
  TEMP_PATH: env.STAGE === "local" ? "./tmp" : "/tmp",
};
