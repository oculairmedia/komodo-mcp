import { z } from 'zod';
import { ConsolidatedToolDefinition, createToolResponse, handleToolError } from './types.js';
import { getKomodoClient } from '../tools/komodo-client.js';

const OPERATIONS = [
  'list',
  'inspect',
  'start',
  'stop',
  'restart'
] as const;

const inputSchema = {
  operation: z.enum(OPERATIONS).describe('Operation to perform'),

  // Common parameters
  server_id: z.string().optional().describe('Server ID (required for list, inspect, start, stop, restart)'),
  container_name: z.string().optional().describe('Container name (required for inspect, start, stop, restart)'),
};

export const komodoContainerOps: ConsolidatedToolDefinition = {
  name: 'komodo_container_ops',
  title: 'Komodo Container Operations',
  description: 'Docker container management hub - Supports 5 operations: list (all containers on server), inspect (container details), start (start container), stop (stop container), restart (restart container)',
  operations: [...OPERATIONS],
  inputSchema,
  handler: async (params) => {
    try {
      const client = getKomodoClient();
      const { operation } = params;

      switch (operation) {
        case 'list': {
          if (!params.server_id) {
            throw new Error('server_id is required for list operation');
          }
          const containers = await client.read('ListDockerContainers', { server: params.server_id });
          return createToolResponse({ containers });
        }

        case 'inspect': {
          if (!params.server_id || !params.container_name) {
            throw new Error('server_id and container_name are required for inspect operation');
          }
          const container = await client.read('InspectDockerContainer', {
            server: params.server_id,
            container: params.container_name
          });
          return createToolResponse({ container });
        }

        case 'start': {
          if (!params.server_id || !params.container_name) {
            throw new Error('server_id and container_name are required for start operation');
          }
          const result = await client.execute('StartContainer', {
            server: params.server_id,
            container: params.container_name
          });
          return createToolResponse({ result });
        }

        case 'stop': {
          if (!params.server_id || !params.container_name) {
            throw new Error('server_id and container_name are required for stop operation');
          }
          const result = await client.execute('StopContainer', {
            server: params.server_id,
            container: params.container_name
          });
          return createToolResponse({ result });
        }

        case 'restart': {
          if (!params.server_id || !params.container_name) {
            throw new Error('server_id and container_name are required for restart operation');
          }
          const result = await client.execute('RestartContainer', {
            server: params.server_id,
            container: params.container_name
          });
          return createToolResponse({ result });
        }

        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    } catch (error) {
      return handleToolError(error);
    }
  },
};
