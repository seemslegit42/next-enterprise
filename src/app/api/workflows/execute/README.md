# Workflow Execution API

This API provides endpoints for executing and managing workflow executions.

## Models

### WorkflowExecution

```typescript
interface WorkflowExecution {
  id: string;
  workflowId: string;
  state: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELED' | 'PAUSED';
  startedAt: Date;
  completedAt?: Date;
  startedBy: string;
  variables?: Record<string, any>;
  logs?: Array<{
    nodeId: string;
    message: string;
    level: string;
    timestamp: Date;
  }>;
  output?: any;
  error?: string;
  nodeStates?: Record<string, {
    state: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
    startedAt: Date | null;
    completedAt: Date | null;
    error: string | null;
    output: any;
  }>;
}
```

## Endpoints

### POST /api/workflows/execute/[workflowId]

Executes a workflow.

**Response:**
```json
{
  "success": true,
  "data": {
    "workflowId": "clq123abc",
    "executionId": "clq456def"
  },
  "message": "Workflow execution initiated successfully"
}
```

### GET /api/workflows/execute/[executionId]

Gets the status of a workflow execution.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clq456def",
    "workflowId": "clq123abc",
    "state": "COMPLETED",
    "startedAt": "2023-01-01T00:00:00.000Z",
    "completedAt": "2023-01-01T00:01:00.000Z",
    "startedBy": "user123",
    "variables": { "key": "value" },
    "logs": [
      {
        "nodeId": "node-1",
        "message": "Executing node",
        "level": "info",
        "timestamp": "2023-01-01T00:00:30.000Z"
      }
    ],
    "output": { "result": "success" },
    "nodeStates": {
      "node-1": {
        "state": "COMPLETED",
        "startedAt": "2023-01-01T00:00:10.000Z",
        "completedAt": "2023-01-01T00:00:50.000Z",
        "error": null,
        "output": { "success": true }
      }
    }
  }
}
```

### DELETE /api/workflows/execute/[executionId]

Cancels a running workflow execution.

**Response:**
```json
{
  "success": true,
  "message": "Execution clq456def canceled"
}
```

## Error Responses

All endpoints return a standard error format:

```json
{
  "success": false,
  "error": "Error message"
}
```

Common error status codes:
- `400`: Bad request
- `401`: Unauthorized
- `403`: Forbidden (trying to access an execution you don't own)
- `404`: Execution not found
- `500`: Server error

## Workflow Execution Process

1. **Initiation**: When a workflow is executed, a new `WorkflowExecution` record is created with state `PENDING`.
2. **Execution**: The execution state changes to `RUNNING` and the workflow is executed asynchronously.
3. **Node Execution**: Each node in the workflow is executed in sequence, with its state tracked in `nodeStates`.
4. **Completion**: When all nodes have been executed, the execution state changes to `COMPLETED`.
5. **Error Handling**: If an error occurs, the execution state changes to `FAILED` and the error is recorded.
6. **Cancellation**: A running execution can be canceled, changing its state to `CANCELED`.

## Agent Task Execution

When an Agent Task node is executed:

1. The agent definition is retrieved from the database.
2. The task prompt is interpolated with variables from the execution context.
3. A request is made to the agent's API endpoint with the appropriate payload.
4. The response is stored in the execution context variables.

## Variable Interpolation

Variables can be interpolated in strings using the `${variable}` syntax. For example:

```
Hello, ${user.name}!
```

This will replace `${user.name}` with the value of `user.name` from the execution context variables.
