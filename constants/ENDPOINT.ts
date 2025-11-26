const BASE_URL = {
    development: "",
    production: "",
} as const;

type Env = keyof typeof BASE_URL;
const currentEnv: Env = (process.env.NODE_ENV as Env) || "development";

export const API_BASE_URL = BASE_URL[currentEnv];

export const ENDPOINT = {

    

} as const;