# API Routes Documentation

This directory contains all the API routes for the Grimoire application. The API follows a RESTful design pattern and uses Next.js API routes.

## Authentication

All API routes are protected with NextAuth.js authentication. Requests must include a valid session cookie or they will receive a 401 Unauthorized response.

## Response Format

All API responses follow a consistent format:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## Available Endpoints

### Tasks

- `GET /api/tasks` - Get all tasks with optional filtering
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/[id]` - Get a specific task
- `PUT /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task
- `GET /api/tasks/count` - Get task counts by status

### Logs

- `GET /api/logs` - Get all logs with optional filtering
- `POST /api/logs` - Create a new log
- `GET /api/logs/[id]` - Get a specific log
- `DELETE /api/logs/[id]` - Delete a log
- `GET /api/logs/count` - Get log counts by level

### Workflows

- `GET /api/workflows` - Get all workflows with optional filtering
- `POST /api/workflows` - Create a new workflow
- `GET /api/workflows/[id]` - Get a specific workflow
- `PUT /api/workflows/[id]` - Update a workflow
- `DELETE /api/workflows/[id]` - Delete a workflow
- `GET /api/workflows/count` - Get workflow counts

### Workflow Execution

- `POST /api/workflows/execute/[id]` - Execute a workflow
- `GET /api/workflows/execute/[id]` - Get execution status
- `DELETE /api/workflows/execute/[id]` - Cancel a workflow execution

### Workflow Execution Logs

- `GET /api/workflows/logs` - Get all workflow execution logs
- `GET /api/workflows/logs/[id]` - Get a specific workflow execution log
- `GET /api/workflows/logs/stats` - Get workflow execution log statistics

### Log Entries

- `GET /api/workflows/logs/entries` - Get log entries with optional filtering
- `POST /api/workflows/logs/entries` - Create a new log entry
- `GET /api/workflows/logs/entries/[id]` - Get a specific log entry
- `DELETE /api/workflows/logs/entries/[id]` - Delete a log entry

### Agents

- `GET /api/agents` - Get all agent definitions
- `POST /api/agents` - Create a new agent definition
- `GET /api/agents/[id]` - Get a specific agent definition
- `PUT /api/agents/[id]` - Update an agent definition
- `DELETE /api/agents/[id]` - Delete an agent definition

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics

## Error Handling

All API routes include proper error handling. If an error occurs, the response will include an `error` field with a description of the error.

## Tracing

All API routes are instrumented with OpenTelemetry tracing. This allows for monitoring and debugging of API requests.

## Database Operations

Database operations are performed using the Prisma ORM. All database operations are wrapped in a `traceDbOperation` function to provide tracing information.
