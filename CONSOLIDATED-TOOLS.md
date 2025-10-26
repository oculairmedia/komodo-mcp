# Komodo MCP Consolidated Tools

This document explains the consolidated multi-tool architecture for the Komodo MCP server, inspired by Huly MCP and Letta MCP patterns.

## Overview

The Komodo MCP server now supports **two implementations**:

1. **Modular** (41 individual tools) - Original implementation with one tool per operation
2. **Consolidated** (7 hub tools) - New implementation with operation-based multi-tools

## Architecture Comparison

### Modular Approach (41 Tools)

**Location**: `src/tools-mcp/` and `src/server-new.ts`

**Structure**:
- Each operation is a separate tool
- Tools organized by category in directories
- Registry imports and registers all 41 tools
- Simple, straightforward - one tool = one operation

**Examples**:
- `list_servers`
- `get_server_info`
- `create_server`
- `update_server`
- `delete_server`
- `rename_server`
- (35 more tools...)

**Pros**:
- ✅ Easy to understand - one tool per operation
- ✅ Simple discovery - tool name = operation name
- ✅ Clear separation of concerns

**Cons**:
- ❌ 41 tools clutter the tool list
- ❌ Harder for agents to grasp the full API surface
- ❌ Repetitive parameter definitions across similar tools

### Consolidated Approach (7 Hub Tools)

**Location**: `src/tools-consolidated/` and `src/server-consolidated.ts`

**Structure**:
- Operations grouped by domain into "hubs"
- Each hub tool uses `operation` discriminator parameter
- Single handler routes to appropriate operation
- Clear operation list in tool description

**Hub Tools**:
1. **`komodo_server_ops`** (6 operations)
   - list, get, create, update, delete, rename

2. **`komodo_deployment_ops`** (8 operations)
   - list, get, create, deploy, start, stop, restart, delete

3. **`komodo_stack_ops`** (8 operations)
   - list, get, deploy, start, stop, restart, destroy, delete

4. **`komodo_build_ops`** (4 operations)
   - list, get, run, delete

5. **`komodo_repo_ops`** (5 operations)
   - list, get, clone, pull, delete

6. **`komodo_container_ops`** (5 operations)
   - list, inspect, start, stop, restart

7. **`komodo_variable_ops`** (5 operations)
   - list, get, create, update, delete

**Pros**:
- ✅ Clean tool list - 7 vs 41 tools
- ✅ Easier for agents to understand domain structure
- ✅ Shared parameters reduce duplication
- ✅ Operation list in description provides discoverability
- ✅ Follows Huly/Letta MCP patterns

**Cons**:
- ❌ Slightly more complex to use (need to specify operation)
- ❌ Requires understanding of operation parameter

## Usage Examples

### Modular Approach

```json
{
  "method": "tools/call",
  "params": {
    "name": "list_servers",
    "arguments": {}
  }
}
```

### Consolidated Approach

```json
{
  "method": "tools/call",
  "params": {
    "name": "komodo_server_ops",
    "arguments": {
      "operation": "list"
    }
  }
}
```

## Running the Servers

### Modular Server (Port 9715)

```bash
npm run dev:modular
# or
npm run start:modular
```

### Consolidated Server (Port 9716)

```bash
npm run dev
# or
npm run start
```

## Implementation Details

### Consolidated Tool Pattern

Each consolidated tool follows this pattern:

```typescript
import { z } from 'zod';
import { ConsolidatedToolDefinition, createToolResponse, handleToolError } from './types.js';
import { getKomodoClient } from '../client.js';

const OPERATIONS = ['list', 'get', 'create', 'update', 'delete'] as const;

const inputSchema = {
  operation: z.enum(OPERATIONS).describe('Operation to perform'),
  // Common parameters for all operations
  id: z.string().optional().describe('Resource ID'),
  // Operation-specific parameters
  name: z.string().optional().describe('Name (required for create)'),
  // ... more parameters
};

export const resourceOps: ConsolidatedToolDefinition = {
  name: 'komodo_resource_ops',
  title: 'Komodo Resource Operations',
  description: 'Resource management hub - Supports 5 operations: list, get, create, update, delete',
  operations: [...OPERATIONS],
  inputSchema,
  handler: async (params) => {
    try {
      const client = getKomodoClient();
      const { operation } = params;

      switch (operation) {
        case 'list':
          const items = await client.list_resources();
          return createToolResponse({ items });

        case 'get':
          if (!params.id) throw new Error('id required for get');
          const item = await client.get_resource(params.id);
          return createToolResponse({ item });

        // ... more cases

        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    } catch (error) {
      return handleToolError(error);
    }
  },
};
```

## Tool Discovery

Agents can discover available operations from the tool description:

```bash
curl -X POST http://localhost:9716/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc": "2.0", "method": "tools/list", "params": {}, "id": 1}'
```

Response includes clear operation lists:
```json
{
  "name": "komodo_server_ops",
  "description": "Server management hub - Supports 6 operations: list (all servers), get (server details), create (new server), update (server config), delete (remove server), rename (change server name)"
}
```

## Recommendation

**Use the Consolidated version by default** for the following reasons:

1. **Better for AI Agents**: Easier to understand the complete API surface with 7 tools vs 41
2. **Industry Pattern**: Matches Huly MCP and Letta MCP best practices
3. **Cleaner Interface**: Less clutter in tool lists
4. **Maintainability**: Easier to add new operations to existing hubs

The modular version remains available for cases where granular tool access is preferred.

## Migration Notes

Both servers are fully functional and can run simultaneously on different ports. No migration is required - choose the version that best fits your use case.

To switch between versions:
- **Consolidated** (default): `npm run dev` → Port 9716
- **Modular**: `npm run dev:modular` → Port 9715

## Pattern Origins

This consolidation pattern is inspired by:
- **Huly MCP**: Uses `entity_type` + `operation` discriminators (e.g., `huly_entity`, `huly_issue_ops`, `huly_query`)
- **Letta MCP**: Uses operation-based hubs with 10-22 operations per hub (e.g., `letta_agent_advanced`, `letta_memory_unified`, `letta_tool_manager`)

Both patterns demonstrate that consolidated multi-tools are easier for agents to grasp and use effectively.
