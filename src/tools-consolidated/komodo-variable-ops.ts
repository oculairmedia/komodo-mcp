import { z } from 'zod';
import { ConsolidatedToolDefinition, createToolResponse, handleToolError } from './types.js';
import { getKomodoClient } from '../tools/komodo-client.js';

const OPERATIONS = [
  'list',
  'get',
  'create',
  'update',
  'delete'
] as const;

const inputSchema = {
  operation: z.enum(OPERATIONS).describe('Operation to perform'),

  // Common parameters
  variable_id: z.string().optional().describe('Variable ID (required for get, update, delete)'),

  // Create parameters
  name: z.string().optional().describe('Variable name (required for create)'),
  value: z.string().optional().describe('Variable value (required for create, update)'),
  description: z.string().optional().describe('Variable description'),
  is_secret: z.boolean().optional().describe('Whether this is a secret variable'),
  tags: z.array(z.string()).optional().describe('Tags for the variable'),
};

export const komodoVariableOps: ConsolidatedToolDefinition = {
  name: 'komodo_variable_ops',
  title: 'Komodo Variable Operations',
  description: 'Variable management hub - Supports 5 operations: list (all variables), get (variable details), create (new variable), update (update value), delete (remove variable)',
  operations: [...OPERATIONS],
  inputSchema,
  handler: async (params) => {
    try {
      const client = getKomodoClient();
      const { operation } = params;

      switch (operation) {
        case 'list': {
          const variables = await client.read('ListVariables', {});
          return createToolResponse({ variables });
        }

        case 'get': {
          if (!params.variable_id) {
            throw new Error('variable_id is required for get operation');
          }
          const variable = await client.read('GetVariable', { variable: params.variable_id });
          return createToolResponse({ variable });
        }

        case 'create': {
          if (!params.name || params.value === undefined) {
            throw new Error('name and value are required for create operation');
          }
          const variable = await client.write('CreateVariable', {
            name: params.name,
            value: params.value,
            description: params.description,
            is_secret: params.is_secret ?? false,
            tags: params.tags,
          });
          return createToolResponse({ variable });
        }

        case 'update': {
          if (!params.variable_id || params.value === undefined) {
            throw new Error('variable_id and value are required for update operation');
          }
          const variable = await client.write('UpdateVariableValue', {
            id: params.variable_id,
            value: params.value
          });
          return createToolResponse({ variable });
        }

        case 'delete': {
          if (!params.variable_id) {
            throw new Error('variable_id is required for delete operation');
          }
          const result = await client.write('DeleteVariable', { id: params.variable_id });
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
