import { cleanEnv, str } from "envalid";

export default cleanEnv(process.env, {
  SERVICE_NAME: str(),
  STAGE: str(),
  DEPLOYMENT_BUCKET: str(),
  AWS_ACCOUNT_ID: str(),
  AWS_REGION: str(),
});
