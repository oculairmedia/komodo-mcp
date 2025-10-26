import { z } from 'zod';
import { ToolDefinition, createToolResponse, handleToolError } from '../types.js';
import { getKomodoClient } from '../../tools/komodo-client.js';

export { listServersTool } from './list-servers.js';

// Get Server Info
export const getServerInfoTool: ToolDefinition = {
  name: 'get_server_info',
  title: 'Get Server Info',
  description: 'Get detailed information about a specific server',
  inputSchema: {
    server_id: z.string().describe('Server ID'),
  },
  outputSchema: {
    server: z.any(),
  },
  handler: async ({ server_id }) => {
    try {
      const client = getKomodoClient();
      const server = await client.get_server(server_id);
      return createToolResponse({ server });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Create Server
export const createServerTool: ToolDefinition = {
  name: 'create_server',
  title: 'Create Server',
  description: 'Create a new server in Komodo',
  inputSchema: {
    name: z.string().describe('Server name'),
    address: z.string().describe('Server address (e.g., http://localhost:8120)'),
    region: z.string().optional().describe('Server region'),
    enabled: z.boolean().optional().default(true).describe('Whether the server is enabled'),
    description: z.string().optional().describe('Server description'),
    tags: z.array(z.string()).optional().describe('Tags for the server'),
  },
  outputSchema: {
    server: z.any(),
  },
  handler: async (params) => {
    try {
      const client = getKomodoClient();
      const server = await client.create_server({
        name: params.name,
        config: {
          address: params.address,
          region: params.region,
          enabled: params.enabled,
        },
        description: params.description,
        tags: params.tags,
      });
      return createToolResponse({ server });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Update Server
export const updateServerTool: ToolDefinition = {
  name: 'update_server',
  title: 'Update Server',
  description: 'Update an existing server configuration',
  inputSchema: {
    server_id: z.string().describe('ID of the server to update'),
    address: z.string().optional().describe('New server address'),
    region: z.string().optional().describe('New server region'),
    enabled: z.boolean().optional().describe('Whether the server is enabled'),
    description: z.string().optional().describe('New server description'),
    tags: z.array(z.string()).optional().describe('New tags for the server'),
  },
  outputSchema: {
    server: z.any(),
  },
  handler: async (params) => {
    try {
      const client = getKomodoClient();
      const updateConfig: any = {};

      if (params.address !== undefined) updateConfig.address = params.address;
      if (params.region !== undefined) updateConfig.region = params.region;
      if (params.enabled !== undefined) updateConfig.enabled = params.enabled;

      const server = await client.update_server(params.server_id, {
        config: Object.keys(updateConfig).length > 0 ? updateConfig : undefined,
        description: params.description,
        tags: params.tags,
      });

      return createToolResponse({ server });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Delete Server
export const deleteServerTool: ToolDefinition = {
  name: 'delete_server',
  title: 'Delete Server',
  description: 'Delete a server from Komodo',
  inputSchema: {
    server_id: z.string().describe('ID of the server to delete'),
  },
  outputSchema: {
    success: z.boolean(),
    message: z.string(),
  },
  handler: async ({ server_id }) => {
    try {
      const client = getKomodoClient();
      await client.delete_server(server_id);
      return createToolResponse({
        success: true,
        message: `Server ${server_id} deleted successfully`
      });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Rename Server
export const renameServerTool: ToolDefinition = {
  name: 'rename_server',
  title: 'Rename Server',
  description: 'Rename a server in Komodo',
  inputSchema: {
    server_id: z.string().describe('ID of the server to rename'),
    new_name: z.string().describe('New name for the server'),
  },
  outputSchema: {
    server: z.any(),
  },
  handler: async ({ server_id, new_name }) => {
    try {
      const client = getKomodoClient();
      const server = await client.rename_server(server_id, new_name);
      return createToolResponse({ server });
    } catch (error) {
      return handleToolError(error);
    }
  },
};
