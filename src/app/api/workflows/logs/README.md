# Workflow Execution Logs API

This API provides endpoints for retrieving workflow execution logs.

## Models

### WorkflowExecutionLog

```typescript
interface WorkflowExecutionLog {
  id: string;
  workflowDefinitionId: string;
  executionId: string;
  startTime: Date;
  endTime?: Date;
  status: 'Running' | 'Completed' | 'Failed';
  logEntries: LogEntry[];
}
```

### LogEntry

```typescript
interface LogEntry {
  id: string;
  timestamp: Date;
  nodeId: string;
  nodeType: string;
  level: 'Info' | 'Warn' | 'Error';
  message: string;
  data?: Record<string, any>;
  workflowExecutionLogId: string;
}
```

## Endpoints

### GET /api/workflows/logs

Gets all workflow execution logs.

**Query Parameters:**
- `workflowId`: Filter logs by workflow ID
- `status`: Filter logs by status ('Running', 'Completed', 'Failed')
- `startDate`: Filter logs by start date (ISO string)
- `endDate`: Filter logs by end date (ISO string)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clq123abc",
      "workflowDefinitionId": "clq456def",
      "executionId": "clq789ghi",
      "startTime": "2023-01-01T00:00:00.000Z",
      "endTime": "2023-01-01T00:01:00.000Z",
      "status": "Completed",
      "logEntries": [
        {
          "id": "clq321cba",
          "timestamp": "2023-01-01T00:00:10.000Z",
          "nodeId": "node-1",
          "nodeType": "START",
          "level": "Info",
          "message": "Executing node: node-1 (START)",
          "data": { "nodeData": {} },
          "workflowExecutionLogId": "clq123abc"
        }
      ]
    }
  ]
}
```

### GET /api/workflows/logs/[id]

Gets a specific workflow execution log by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clq123abc",
    "workflowDefinitionId": "clq456def",
    "executionId": "clq789ghi",
    "startTime": "2023-01-01T00:00:00.000Z",
    "endTime": "2023-01-01T00:01:00.000Z",
    "status": "Completed",
    "logEntries": [
      {
        "id": "clq321cba",
        "timestamp": "2023-01-01T00:00:10.000Z",
        "nodeId": "node-1",
        "nodeType": "START",
        "level": "Info",
        "message": "Executing node: node-1 (START)",
        "data": { "nodeData": {} },
        "workflowExecutionLogId": "clq123abc"
      }
    ]
  }
}
```

## Integration with Workflow Execution

When a workflow is executed:

1. A `WorkflowExecutionLog` record is created with status `Running`
2. As the workflow interpreter runs through nodes, `LogEntry` records are created
3. When the workflow completes, the `WorkflowExecutionLog` status is updated to `Completed`
4. If the workflow fails, the `WorkflowExecutionLog` status is updated to `Failed`

This provides a detailed audit trail of workflow executions, which is essential for observability dashboards.
