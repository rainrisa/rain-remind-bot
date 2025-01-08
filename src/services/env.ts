import dotenv from "dotenv";
import { cleanEnv, makeValidator, str } from "envalid";

dotenv.config();

const numArr = makeValidator<number[]>((input: string) => {
  const coerced = input.split(" ").map(Number);
  return coerced;
});
const env = cleanEnv(process.env, {
  DATABASE_URI: str(),
  BOT_TOKEN: str(),
  ADMIN_IDS: numArr(),
  CRON_PATTERN: str(),
});

export default env;
