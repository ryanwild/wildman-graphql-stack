import fs from "node:fs";
import { loadEnvFile } from "node:process";
import * as v from "valibot";
import { memoize } from "./memoize.ts";

const EnvironmentSchema = v.object({
  BETTER_AUTH_SECRET: v.string(),
  BETTER_AUTH_URL: v.string(),
  BACKEND_DEBUG: v.pipe(v.string(), v.toBoolean()),
  BACKEND_LOG_LEVEL: v.string(),
  DB_HOST: v.string(),
  DB_NAME: v.string(),
  DB_PASSWORD: v.string(),
  DB_PORT: v.pipe(v.string(), v.toNumber()),
  DB_USER: v.string(),
  DB_USE_SSL: v.pipe(v.string(), v.toBoolean()),
  DOMAIN: v.string(),
  NODE_ENV: v.string(),
});

export type Environment = v.InferOutput<typeof EnvironmentSchema> & {
  DB_URL: string;
};

const environment = memoize((): Environment => {
  const envFilePath = new URL("../../.env", import.meta.url);
  if (fs.existsSync(envFilePath)) {
    loadEnvFile(envFilePath);
  }
  const env = v.parse(EnvironmentSchema, process.env);
  /*
The database URL follows this structure:

postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
             └──┘ └───────┘ └─────────────────────────────────────────────┘ └────┘
              ʌ    ʌ          ʌ                                              ʌ
        role -│    │          │- hostname                                    │- database
                   │
                   │- password
*/
  const generatedEnv = {
    DB_URL: `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
  };
  return { ...env, ...generatedEnv };
});

export { environment };
