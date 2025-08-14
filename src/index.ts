#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { initializeKomodoClient } from './client.js';
import { serversModule } from './resources/servers.js';
import { stacksModule } from './resources/stacks.js';
import { deploymentsModule } from './resources/deployments.js';
import { buildsModule } from './resources/builds.js';
import { reposModule } from './resources/repos.js';
import { proceduresModule } from './resources/procedures.js';
import { systemModule } from './resources/system.js';
import { ResourceModule } from './types.js';

// Initialize the server
const server = new Server(
  {
    name: 'komodo-mcp-server',
    version: '0.2.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize Komodo client
initializeKomodoClient({
  url: process.env.KOMODO_URL!,
  key: process.env.KOMODO_KEY!,
  secret: process.env.KOMODO_SECRET!,
});

// Collect all resource modules
const resourceModules: ResourceModule[] = [
  serversModule,
  stacksModule,
  deploymentsModule,
  buildsModule,
  reposModule,
  proceduresModule,
  systemModule,
];

// Collect all tools from resource modules
const allTools = resourceModules.flatMap(module => module.getTools());

// Collect all handlers from resource modules
const allHandlers: Record<string, any> = resourceModules.reduce((acc, module) => {
  return { ...acc, ...module.getHandlers() };
}, {} as Record<string, any>);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: allTools,
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const handler = allHandlers[name];
    if (!handler) {
      throw new McpError(
        ErrorCode.MethodNotFound,
        `Unknown tool: ${name}`
      );
    }

    return await handler(args);
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    
    console.error(`Error executing tool ${name}:`, error);
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to execute ${name}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Komodo MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});