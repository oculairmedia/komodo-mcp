import { z } from 'zod';
import { ConsolidatedToolDefinition, createToolResponse, handleToolError } from './types.js';
import { getKomodoClient } from '../tools/komodo-client.js';

const OPERATIONS = [
  'list',
  'get',
  'deploy',
  'start',
  'stop',
  'restart',
  'destroy',
  'delete'
] as const;

const inputSchema = {
  operation: z.enum(OPERATIONS).describe('Operation to perform'),

  // Common parameters
  stack_id: z.string().optional().describe('Stack ID (required for get, deploy, start, stop, restart, destroy, delete)'),
};

export const komodoStackOps: ConsolidatedToolDefinition = {
  name: 'komodo_stack_ops',
  title: 'Komodo Stack Operations',
  description: 'Stack management hub - Supports 8 operations: list (all stacks), get (stack details), deploy (deploy stack), start (start stack), stop (stop stack), restart (restart stack), destroy (destroy stack containers), delete (remove stack)',
  operations: [...OPERATIONS],
  inputSchema,
  handler: async (params) => {
    try {
      const client = getKomodoClient();
      const { operation } = params;

      switch (operation) {
        case 'list': {
          const stacks = await client.read('ListStacks', {});
          return createToolResponse({ stacks });
        }

        case 'get': {
          if (!params.stack_id) {
            throw new Error('stack_id is required for get operation');
          }
          const stack = await client.read('GetStack', { stack: params.stack_id });
          return createToolResponse({ stack });
        }

        case 'deploy': {
          if (!params.stack_id) {
            throw new Error('stack_id is required for deploy operation');
          }
          const result = await client.execute('DeployStack', { stack: params.stack_id });
          return createToolResponse({ result });
        }

        case 'start': {
          if (!params.stack_id) {
            throw new Error('stack_id is required for start operation');
          }
          const result = await client.execute('StartStack', { stack: params.stack_id });
          return createToolResponse({ result });
        }

        case 'stop': {
          if (!params.stack_id) {
            throw new Error('stack_id is required for stop operation');
          }
          const result = await client.execute('StopStack', { stack: params.stack_id });
          return createToolResponse({ result });
        }

        case 'restart': {
          if (!params.stack_id) {
            throw new Error('stack_id is required for restart operation');
          }
          const result = await client.execute('RestartStack', { stack: params.stack_id });
          return createToolResponse({ result });
        }

        case 'destroy': {
          if (!params.stack_id) {
            throw new Error('stack_id is required for destroy operation');
          }
          const result = await client.execute('DestroyStack', { stack: params.stack_id });
          return createToolResponse({ result });
        }

        case 'delete': {
          if (!params.stack_id) {
            throw new Error('stack_id is required for delete operation');
          }
          const result = await client.write('DeleteStack', { id: params.stack_id });
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
