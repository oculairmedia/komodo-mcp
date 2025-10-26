import { z } from 'zod';
import { ConsolidatedToolDefinition, createToolResponse, handleToolError } from './types.js';
import { getKomodoClient } from '../tools/komodo-client.js';

const OPERATIONS = [
  'list',
  'get',
  'create',
  'update',
  'delete',
  'rename'
] as const;

const inputSchema = {
  operation: z.enum(OPERATIONS).describe('Operation to perform'),

  // Common parameters
  server_id: z.string().optional().describe('Server ID (required for get, update, delete, rename)'),

  // Create/Update parameters
  name: z.string().optional().describe('Server name (required for create)'),
  address: z.string().optional().describe('Server address (required for create, e.g., http://localhost:8120)'),
  region: z.string().optional().describe('Server region'),
  enabled: z.boolean().optional().describe('Whether the server is enabled'),
  description: z.string().optional().describe('Server description'),
  tags: z.array(z.string()).optional().describe('Tags for the server'),

  // Rename parameters
  new_name: z.string().optional().describe('New server name (required for rename operation)'),
};

export const komodoServerOps: ConsolidatedToolDefinition = {
  name: 'komodo_server_ops',
  title: 'Komodo Server Operations',
  description: 'Server management hub - Supports 6 operations: list (all servers), get (server details), create (new server), update (server config), delete (remove server), rename (change server name)',
  operations: [...OPERATIONS],
  inputSchema,
  handler: async (params) => {
    try {
      const client = getKomodoClient();
      const { operation } = params;

      switch (operation) {
        case 'list': {
          const servers = await client.read('ListServers', {});
          return createToolResponse({ servers });
        }

        case 'get': {
          if (!params.server_id) {
            throw new Error('server_id is required for get operation');
          }
          const server = await client.read('GetServer', { server: params.server_id });
          return createToolResponse({ server });
        }

        case 'create': {
          if (!params.name || !params.address) {
            throw new Error('name and address are required for create operation');
          }
          const server = await client.write('CreateServer', {
            name: params.name,
            config: {
              address: params.address,
              region: params.region,
              enabled: params.enabled ?? true,
            },
            description: params.description,
            tags: params.tags,
          });
          return createToolResponse({ server });
        }

        case 'update': {
          if (!params.server_id) {
            throw new Error('server_id is required for update operation');
          }
          const updateData: any = { id: params.server_id };
          if (params.name) updateData.name = params.name;
          if (params.description !== undefined) updateData.description = params.description;
          if (params.tags) updateData.tags = params.tags;

          const config: any = {};
          if (params.address) config.address = params.address;
          if (params.region !== undefined) config.region = params.region;
          if (params.enabled !== undefined) config.enabled = params.enabled;
          if (Object.keys(config).length > 0) updateData.config = config;

          const server = await client.write('UpdateServer', updateData);
          return createToolResponse({ server });
        }

        case 'delete': {
          if (!params.server_id) {
            throw new Error('server_id is required for delete operation');
          }
          const result = await client.write('DeleteServer', { id: params.server_id });
          return createToolResponse({ result });
        }

        case 'rename': {
          if (!params.server_id || !params.new_name) {
            throw new Error('server_id and new_name are required for rename operation');
          }
          const server = await client.write('RenameServer', { id: params.server_id, name: params.new_name });
          return createToolResponse({ server });
        }

        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    } catch (error) {
      return handleToolError(error);
    }
  },
};
