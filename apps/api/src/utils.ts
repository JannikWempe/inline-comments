export const getEnvOrThrow = (envKey: string): string => {
  const envValue = process.env[envKey];
  if (!envValue) {
    throw new Error(`Missing env variable: ${envKey}`);
  }
  return envValue;
};
