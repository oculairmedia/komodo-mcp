import { z } from 'zod';
import { ConsolidatedToolDefinition, createToolResponse, handleToolError } from './types.js';
import { getKomodoClient } from '../tools/komodo-client.js';

const OPERATIONS = [
  'list',
  'get',
  'run',
  'delete'
] as const;

const inputSchema = {
  operation: z.enum(OPERATIONS).describe('Operation to perform'),

  // Common parameters
  build_id: z.string().optional().describe('Build ID (required for get, run, delete)'),
};

export const komodoBuildOps: ConsolidatedToolDefinition = {
  name: 'komodo_build_ops',
  title: 'Komodo Build Operations',
  description: 'Build management hub - Supports 4 operations: list (all builds), get (build details), run (execute build), delete (remove build)',
  operations: [...OPERATIONS],
  inputSchema,
  handler: async (params) => {
    try {
      const client = getKomodoClient();
      const { operation } = params;

      switch (operation) {
        case 'list': {
          const builds = await client.read('ListBuilds', {});
          return createToolResponse({ builds });
        }

        case 'get': {
          if (!params.build_id) {
            throw new Error('build_id is required for get operation');
          }
          const build = await client.read('GetBuild', { build: params.build_id });
          return createToolResponse({ build });
        }

        case 'run': {
          if (!params.build_id) {
            throw new Error('build_id is required for run operation');
          }
          const result = await client.execute('RunBuild', { build: params.build_id });
          return createToolResponse({ result });
        }

        case 'delete': {
          if (!params.build_id) {
            throw new Error('build_id is required for delete operation');
          }
          const result = await client.write('DeleteBuild', { id: params.build_id });
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
