# Database Schema Documentation

## Authentication Schema (`next_auth`)

### API Keys Table (`next_auth.api_keys`)

This table stores API keys for authenticated users.

#### Table Structure
- `id`: UUID (Primary Key)
- `key`: String (API Key value)
- `name`: String (Key identifier)
- `created_at`: Timestamp
- `deleted_at`: Timestamp (Soft delete)

#### Access Patterns
- Queries are performed through the `next_auth.api_keys` fully qualified path
- All operations require authentication
- Soft deletes are implemented using the `deleted_at` column

#### Security
- RLS policies enforce user-based access control
- API keys are validated through the `validate-key` endpoint
- Schema is protected through proper role-based permissions 