import { SchemaError } from '@/app/types/supabase';

export class DatabaseError extends Error {
  code: string;
  details: string | null;
  hint: string | null;
  schema: string;

  constructor(error: SchemaError) {
    super(error.message);
    this.code = error.code;
    this.details = error.details;
    this.hint = error.hint;
    this.schema = error.schema;
    this.name = 'DatabaseError';
  }
}

export function handleDatabaseError(error: SchemaError): never {
  console.error('Database Error:', {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
    schema: error.schema
  });
  
  throw new DatabaseError(error);
} 