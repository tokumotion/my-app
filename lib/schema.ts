// Define schema constants
export const DB_SCHEMAS = {
  AUTH: 'next_auth'
} as const;

// Define table paths
export const DB_TABLES = {
  API_KEYS: {
    name: 'api_keys',
    schema: DB_SCHEMAS.AUTH,
    fullPath: 'api_keys'
  }
} as const; 