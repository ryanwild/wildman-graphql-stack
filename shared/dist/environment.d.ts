import * as v from "valibot";
declare const EnvironmentSchema: v.ObjectSchema<{
    readonly BETTER_AUTH_SECRET: v.StringSchema<undefined>;
    readonly BETTER_AUTH_URL: v.StringSchema<undefined>;
    readonly BACKEND_DEBUG: v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.ToBooleanAction<string>]>;
    readonly BACKEND_LOG_LEVEL: v.StringSchema<undefined>;
    readonly DB_HOST: v.StringSchema<undefined>;
    readonly DB_NAME: v.StringSchema<undefined>;
    readonly DB_PASSWORD: v.StringSchema<undefined>;
    readonly DB_PORT: v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.ToNumberAction<string, undefined>]>;
    readonly DB_USER: v.StringSchema<undefined>;
    readonly DB_USE_SSL: v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.ToBooleanAction<string>]>;
    readonly DOMAIN: v.StringSchema<undefined>;
    readonly NODE_ENV: v.StringSchema<undefined>;
}, undefined>;
export type Environment = v.InferOutput<typeof EnvironmentSchema> & {
    DB_URL: string;
};
declare const environment: (() => Environment) & {
    clear: () => void;
};
export { environment };
