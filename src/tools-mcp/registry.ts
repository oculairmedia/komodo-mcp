import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ToolDefinition } from './types.js';

// Import all tools
import * as serverTools from './servers/index.js';
import * as deploymentTools from './deployments/index.js';
import * as stackTools from './stacks/index.js';
import * as buildTools from './builds/index.js';
import * as repoTools from './repos/index.js';
import * as containerTools from './containers/index.js';
import * as variableTools from './variables/index.js';

export function registerAllTools(server: McpServer) {
  const allTools: ToolDefinition[] = [
    // Server tools
    serverTools.listServersTool,
    serverTools.getServerInfoTool,
    serverTools.createServerTool,
    serverTools.updateServerTool,
    serverTools.deleteServerTool,
    serverTools.renameServerTool,

    // Deployment tools
    deploymentTools.listDeploymentsTool,
    deploymentTools.getDeploymentTool,
    deploymentTools.createDeploymentTool,
    deploymentTools.deployTool,
    deploymentTools.startDeploymentTool,
    deploymentTools.stopDeploymentTool,
    deploymentTools.restartDeploymentTool,
    deploymentTools.deleteDeploymentTool,

    // Stack tools
    stackTools.listStacksTool,
    stackTools.getStackTool,
    stackTools.deployStackTool,
    stackTools.startStackTool,
    stackTools.stopStackTool,
    stackTools.restartStackTool,
    stackTools.destroyStackTool,
    stackTools.deleteStackTool,

    // Build tools
    buildTools.listBuildsTool,
    buildTools.getBuildTool,
    buildTools.runBuildTool,
    buildTools.deleteBuildTool,

    // Repo tools
    repoTools.listReposTool,
    repoTools.getRepoTool,
    repoTools.cloneRepoTool,
    repoTools.pullRepoTool,
    repoTools.deleteRepoTool,

    // Container tools
    containerTools.listDockerContainersTool,
    containerTools.inspectDockerContainerTool,
    containerTools.startContainerTool,
    containerTools.stopContainerTool,
    containerTools.restartContainerTool,

    // Variable tools
    variableTools.listVariablesTool,
    variableTools.getVariableTool,
    variableTools.createVariableTool,
    variableTools.updateVariableValueTool,
    variableTools.deleteVariableTool,
  ];

  // Register each tool with the MCP server
  allTools.forEach((tool) => {
    server.registerTool(
      tool.name,
      {
        title: tool.title,
        description: tool.description,
        inputSchema: tool.inputSchema,
        outputSchema: tool.outputSchema,
      },
      tool.handler
    );
  });

  console.log(`Registered ${allTools.length} tools`);
}
