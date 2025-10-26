import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ConsolidatedToolDefinition } from './types.js';

// Import all consolidated tools
import { komodoServerOps } from './komodo-server-ops.js';
import { komodoDeploymentOps } from './komodo-deployment-ops.js';
import { komodoStackOps } from './komodo-stack-ops.js';
import { komodoBuildOps } from './komodo-build-ops.js';
import { komodoRepoOps } from './komodo-repo-ops.js';
import { komodoContainerOps } from './komodo-container-ops.js';
import { komodoVariableOps } from './komodo-variable-ops.js';

/**
 * Register all consolidated tools with the MCP server
 */
export function registerConsolidatedTools(server: McpServer) {
  const allTools: ConsolidatedToolDefinition[] = [
    komodoServerOps,
    komodoDeploymentOps,
    komodoStackOps,
    komodoBuildOps,
    komodoRepoOps,
    komodoContainerOps,
    komodoVariableOps,
  ];

  // Register each consolidated tool with the MCP server
  allTools.forEach((tool) => {
    server.registerTool(
      tool.name,
      {
        title: tool.title,
        description: tool.description,
        inputSchema: tool.inputSchema,
      },
      tool.handler
    );
  });

  console.log(`Registered ${allTools.length} consolidated tools`);

  // Log operations summary
  allTools.forEach((tool) => {
    console.log(`  - ${tool.name}: ${tool.operations.length} operations`);
  });
}
