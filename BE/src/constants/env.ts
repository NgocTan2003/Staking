const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
        throw new Error(`Environment variable ${key} is not defined`);
    }
    return value;
}

export const MONGO_URI = getEnv("MONGO_URI");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
export const APP_DOMAIN = getEnv("APP_DOMAIN");
export const PORT = getEnv("PORT");
export const NODE_ENV = getEnv("NODE_ENV");