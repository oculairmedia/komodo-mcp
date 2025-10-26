import { z } from 'zod';
import { ToolDefinition, createToolResponse, handleToolError } from '../types.js';
import { getKomodoClient } from '../../tools/komodo-client.js';

export const listServersTool: ToolDefinition = {
  name: 'list_servers',
  title: 'List Servers',
  description: 'List all available servers in Komodo',
  inputSchema: {},
  outputSchema: {
    servers: z.array(z.any()),
  },
  handler: async () => {
    try {
      const client = getKomodoClient();
      const servers = await client.list_servers({});
      return createToolResponse({ servers });
    } catch (error) {
      return handleToolError(error);
    }
  },
};
