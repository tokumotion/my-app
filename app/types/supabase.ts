import { ApiKey } from './apiKey';
import { DB_SCHEMAS } from '@/lib/schema';

export type SchemaError = {
  code: string;
  message: string;
  details: string | null;
  hint: string | null;
  schema: typeof DB_SCHEMAS[keyof typeof DB_SCHEMAS];
};

export type ApiResponse<T> = {
  data: T | null;
  error: SchemaError | null;
};

export type ApiKeyResponse = ApiResponse<ApiKey>;