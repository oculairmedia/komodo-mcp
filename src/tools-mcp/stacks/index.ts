import { z } from 'zod';
import { ToolDefinition, createToolResponse, handleToolError } from '../types.js';
import { getKomodoClient } from '../../tools/komodo-client.js';

// List Stacks
export const listStacksTool: ToolDefinition = {
  name: 'list_stacks',
  title: 'List Stacks',
  description: 'List all available stacks in Komodo',
  inputSchema: {},
  outputSchema: {
    stacks: z.array(z.any()),
  },
  handler: async () => {
    try {
      const client = getKomodoClient();
      const stacks = await client.list_stacks({});
      return createToolResponse({ stacks });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Get Stack
export const getStackTool: ToolDefinition = {
  name: 'get_stack',
  title: 'Get Stack',
  description: 'Get detailed information about a specific stack',
  inputSchema: {
    stack_id: z.string().describe('Stack ID'),
  },
  outputSchema: {
    stack: z.any(),
  },
  handler: async ({ stack_id }) => {
    try {
      const client = getKomodoClient();
      const stack = await client.get_stack(stack_id);
      return createToolResponse({ stack });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Deploy Stack
export const deployStackTool: ToolDefinition = {
  name: 'deploy_stack',
  title: 'Deploy Stack',
  description: 'Deploy a stack (docker-compose up)',
  inputSchema: {
    stack_id: z.string().describe('Stack ID a desplegar'),
  },
  outputSchema: {
    update: z.any(),
  },
  handler: async ({ stack_id }) => {
    try {
      const client = getKomodoClient();
      const update = await client.deploy_stack(stack_id);
      return createToolResponse({ update });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Start Stack
export const startStackTool: ToolDefinition = {
  name: 'start_stack',
  title: 'Start Stack',
  description: 'Start stack services',
  inputSchema: {
    stack_id: z.string().describe('Stack ID a iniciar'),
  },
  outputSchema: {
    update: z.any(),
  },
  handler: async ({ stack_id }) => {
    try {
      const client = getKomodoClient();
      const update = await client.start_stack(stack_id);
      return createToolResponse({ update });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Stop Stack
export const stopStackTool: ToolDefinition = {
  name: 'stop_stack',
  title: 'Stop Stack',
  description: 'Stop stack services',
  inputSchema: {
    stack_id: z.string().describe('Stack ID a detener'),
  },
  outputSchema: {
    update: z.any(),
  },
  handler: async ({ stack_id }) => {
    try {
      const client = getKomodoClient();
      const update = await client.stop_stack(stack_id);
      return createToolResponse({ update });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Restart Stack
export const restartStackTool: ToolDefinition = {
  name: 'restart_stack',
  title: 'Restart Stack',
  description: 'Restart stack services',
  inputSchema: {
    stack_id: z.string().describe('Stack ID a reiniciar'),
  },
  outputSchema: {
    update: z.any(),
  },
  handler: async ({ stack_id }) => {
    try {
      const client = getKomodoClient();
      const update = await client.restart_stack(stack_id);
      return createToolResponse({ update });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Destroy Stack
export const destroyStackTool: ToolDefinition = {
  name: 'destroy_stack',
  title: 'Destroy Stack',
  description: 'Destroy a stack (docker-compose down)',
  inputSchema: {
    stack_id: z.string().describe('Stack ID a destruir'),
  },
  outputSchema: {
    update: z.any(),
  },
  handler: async ({ stack_id }) => {
    try {
      const client = getKomodoClient();
      const update = await client.destroy_stack(stack_id);
      return createToolResponse({ update });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Delete Stack
export const deleteStackTool: ToolDefinition = {
  name: 'delete_stack',
  title: 'Delete Stack',
  description: 'Delete a stack from Komodo',
  inputSchema: {
    stack_id: z.string().describe('Stack ID a eliminar'),
  },
  outputSchema: {
    success: z.boolean(),
    message: z.string(),
  },
  handler: async ({ stack_id }) => {
    try {
      const client = getKomodoClient();
      await client.delete_stack(stack_id);
      return createToolResponse({
        success: true,
        message: `Stack ${stack_id} deleted successfully`
      });
    } catch (error) {
      return handleToolError(error);
    }
  },
};
