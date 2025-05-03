# Agent API

This API provides endpoints for managing agent definitions in the system.

## Models

### AgentDefinition

```typescript
interface AgentDefinition {
  id: string;
  name: string;
  description?: string;
  provider: 'SuperAGI' | 'AutoGen' | 'OpenAI_Assistant' | 'Custom';
  config: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
```

## Endpoints

### GET /api/agents

Retrieves a list of all agents with optional filtering.

**Query Parameters:**
- `provider`: Filter by provider type
- `createdBy`: Filter by creator user ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clq123abc",
      "name": "My Agent",
      "description": "Description of my agent",
      "provider": "OpenAI_Assistant",
      "config": { "apiKey": "***", "modelName": "gpt-4" },
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "createdBy": "user123"
    }
  ]
}
```

### POST /api/agents

Creates a new agent.

**Request Body:**
```json
{
  "name": "My Agent",
  "description": "Description of my agent",
  "provider": "OpenAI_Assistant",
  "config": {
    "apiKey": "sk-...",
    "modelName": "gpt-4",
    "temperature": 0.7
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clq123abc",
    "name": "My Agent",
    "description": "Description of my agent",
    "provider": "OpenAI_Assistant",
    "config": { "apiKey": "***", "modelName": "gpt-4", "temperature": 0.7 },
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z",
    "createdBy": "user123"
  },
  "message": "Agent created successfully"
}
```

### GET /api/agents/[id]

Retrieves a specific agent by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clq123abc",
    "name": "My Agent",
    "description": "Description of my agent",
    "provider": "OpenAI_Assistant",
    "config": { "apiKey": "***", "modelName": "gpt-4" },
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z",
    "createdBy": "user123"
  }
}
```

### PATCH /api/agents/[id]

Updates an existing agent.

**Request Body:**
```json
{
  "name": "Updated Agent Name",
  "config": {
    "temperature": 0.5
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clq123abc",
    "name": "Updated Agent Name",
    "description": "Description of my agent",
    "provider": "OpenAI_Assistant",
    "config": { "apiKey": "***", "modelName": "gpt-4", "temperature": 0.5 },
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-02T00:00:00.000Z",
    "createdBy": "user123"
  },
  "message": "Agent updated successfully"
}
```

### DELETE /api/agents/[id]

Deletes an agent.

**Response:**
```json
{
  "success": true,
  "message": "Agent deleted successfully"
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
- `400`: Validation error
- `401`: Unauthorized
- `403`: Forbidden (trying to update/delete an agent you don't own)
- `404`: Agent not found
- `500`: Server error
