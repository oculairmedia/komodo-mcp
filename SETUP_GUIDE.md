# Komodo MCP Server - Two Implementations

This repository contains TWO working MCP server implementations:

## 1. Official MCP SDK Implementation ✅ WORKING
**Location**: `src/server.ts`
- Uses `@modelcontextprotocol/sdk` v1.20.1
- Fully MCP-compliant HTTP transport
- Works with ALL MCP clients

**Run it**:
```bash
pnpm dev              # Development mode
pnpm build && pnpm start  # Production mode
```

**Test it**:
```bash
curl -X POST http://localhost:9715/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc": "2.0", "method": "tools/list", "params": {}, "id": 1}'
```

## 2. XMCP Implementation ⚠️ INCOMPATIBLE
**Location**: `src/tools/` + `xmcp.config.ts`
- Uses `xmcp` framework v0.3.4
- Custom session-based HTTP (NOT standard MCP)
- Requires sessionId parameter (not in MCP spec)

**Run it**:
```bash
pnpm dev:xmcp         # Development mode
pnpm build:xmcp && pnpm start:xmcp  # Production mode
```

**Issue**: Returns "Missing sessionId parameter" with standard MCP clients

## Current Tools (Both Implementations)

1. **list_servers** - Lists all Komodo servers
2. **get_server_info** - Gets server details by ID
3. **create_server** - Creates a new Komodo server

## Switching Between Implementations

The `package.json` scripts control which version runs:

```json
"dev": "tsx src/server.ts",        // Official MCP SDK
"dev:xmcp": "xmcp dev",             // XMCP framework
```

## Recommendation

Use the **Official MCP SDK** implementation (`src/server.ts`) for production. It's fully compliant with the MCP specification and works with all standard MCP clients.
