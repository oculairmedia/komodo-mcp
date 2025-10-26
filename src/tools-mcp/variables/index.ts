import { z } from 'zod';
import { ToolDefinition, createToolResponse, handleToolError } from '../types.js';
import { getKomodoClient } from '../../tools/komodo-client.js';

// List Variables
export const listVariablesTool: ToolDefinition = {
  name: 'list_variables',
  title: 'List Variables',
  description: 'List all available variables in Komodo',
  inputSchema: {},
  outputSchema: {
    variables: z.array(z.any()),
  },
  handler: async () => {
    try {
      const client = getKomodoClient();
      const variables = await client.list_variables({});
      return createToolResponse({ variables });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Get Variable
export const getVariableTool: ToolDefinition = {
  name: 'get_variable',
  title: 'Get Variable',
  description: 'Get information about a specific variable',
  inputSchema: {
    variable_id: z.string().describe('Variable ID'),
  },
  outputSchema: {
    variable: z.any(),
  },
  handler: async ({ variable_id }) => {
    try {
      const client = getKomodoClient();
      const variable = await client.get_variable(variable_id);
      return createToolResponse({ variable });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Create Variable
export const createVariableTool: ToolDefinition = {
  name: 'create_variable',
  title: 'Create Variable',
  description: 'Create a new variable in Komodo',
  inputSchema: {
    name: z.string().describe('Variable name'),
    value: z.string().describe('Variable value'),
    description: z.string().optional().describe('Variable description'),
    is_secret: z.boolean().optional().default(false).describe('Whether the variable is secret'),
  },
  outputSchema: {
    variable: z.any(),
  },
  handler: async (params) => {
    try {
      const client = getKomodoClient();
      const variable = await client.create_variable({
        name: params.name,
        value: params.value,
        description: params.description,
        is_secret: params.is_secret,
      });
      return createToolResponse({ variable });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Update Variable Value
export const updateVariableValueTool: ToolDefinition = {
  name: 'update_variable_value',
  title: 'Update Variable Value',
  description: 'Update a variable value',
  inputSchema: {
    variable_id: z.string().describe('Variable ID'),
    value: z.string().describe('New value'),
  },
  outputSchema: {
    variable: z.any(),
  },
  handler: async ({ variable_id, value }) => {
    try {
      const client = getKomodoClient();
      const variable = await client.update_variable_value(variable_id, value);
      return createToolResponse({ variable });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Delete Variable
export const deleteVariableTool: ToolDefinition = {
  name: 'delete_variable',
  title: 'Delete Variable',
  description: 'Delete a variable from Komodo',
  inputSchema: {
    variable_id: z.string().describe('Variable ID a eliminar'),
  },
  outputSchema: {
    success: z.boolean(),
    message: z.string(),
  },
  handler: async ({ variable_id }) => {
    try {
      const client = getKomodoClient();
      await client.delete_variable(variable_id);
      return createToolResponse({
        success: true,
        message: `Variable ${variable_id} deleted successfully`
      });
    } catch (error) {
      return handleToolError(error);
    }
  },
};
