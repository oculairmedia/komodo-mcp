import { z } from 'zod';
import { ToolDefinition, createToolResponse, handleToolError } from '../types.js';
import { getKomodoClient } from '../../tools/komodo-client.js';

// List Builds
export const listBuildsTool: ToolDefinition = {
  name: 'list_builds',
  title: 'List Builds',
  description: 'List all available builds in Komodo',
  inputSchema: {},
  outputSchema: {
    builds: z.array(z.any()),
  },
  handler: async () => {
    try {
      const client = getKomodoClient();
      const builds = await client.list_builds({});
      return createToolResponse({ builds });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Get Build
export const getBuildTool: ToolDefinition = {
  name: 'get_build',
  title: 'Get Build',
  description: 'Get detailed information about a specific build',
  inputSchema: {
    build_id: z.string().describe('Build ID'),
  },
  outputSchema: {
    build: z.any(),
  },
  handler: async ({ build_id }) => {
    try {
      const client = getKomodoClient();
      const build = await client.get_build(build_id);
      return createToolResponse({ build });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Run Build
export const runBuildTool: ToolDefinition = {
  name: 'run_build',
  title: 'Run Build',
  description: 'Execute a build',
  inputSchema: {
    build_id: z.string().describe('Build ID a ejecutar'),
  },
  outputSchema: {
    update: z.any(),
  },
  handler: async ({ build_id }) => {
    try {
      const client = getKomodoClient();
      const update = await client.run_build(build_id);
      return createToolResponse({ update });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Delete Build
export const deleteBuildTool: ToolDefinition = {
  name: 'delete_build',
  title: 'Delete Build',
  description: 'Delete a build from Komodo',
  inputSchema: {
    build_id: z.string().describe('Build ID a eliminar'),
  },
  outputSchema: {
    success: z.boolean(),
    message: z.string(),
  },
  handler: async ({ build_id }) => {
    try {
      const client = getKomodoClient();
      await client.delete_build(build_id);
      return createToolResponse({
        success: true,
        message: `Build ${build_id} deleted successfully`
      });
    } catch (error) {
      return handleToolError(error);
    }
  },
};
