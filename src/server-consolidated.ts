import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
import { registerConsolidatedTools } from './tools-consolidated/registry.js';

// Create MCP server
const server = new McpServer({
  name: 'komodo-mcp-server-consolidated',
  version: '2.0.0',
});

// Register all consolidated tools from the registry
registerConsolidatedTools(server);

// Setup Express and HTTP transport
const app = express();
app.use(express.json());

app.post('/mcp', async (req, res) => {
  // Create a new transport for each request in stateless mode
  // This prevents request ID collisions between different clients
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  res.on('close', () => {
    transport.close();
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const port = parseInt(process.env.PORT || '9716');
app.listen(port, () => {
  console.log(`Komodo MCP Server (Consolidated) running on http://localhost:${port}/mcp`);
  console.log('Tools: 7 consolidated operation hubs instead of 41 individual tools');
}).on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});
