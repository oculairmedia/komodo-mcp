import { z } from 'zod';
import { ToolDefinition, createToolResponse, handleToolError } from '../types.js';
import { getKomodoClient } from '../../tools/komodo-client.js';

// List Docker Containers
export const listDockerContainersTool: ToolDefinition = {
  name: 'list_docker_containers',
  title: 'List Docker Containers',
  description: 'List all Docker containers',
  inputSchema: {},
  outputSchema: {
    containers: z.array(z.any()),
  },
  handler: async () => {
    try {
      const client = getKomodoClient();
      const containers = await client.list_docker_containers({});
      return createToolResponse({ containers });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Inspect Docker Container
export const inspectDockerContainerTool: ToolDefinition = {
  name: 'inspect_docker_container',
  title: 'Inspect Docker Container',
  description: 'Inspect a specific Docker container',
  inputSchema: {
    server_id: z.string().describe('Server ID'),
    container_name: z.string().describe('Container name'),
  },
  outputSchema: {
    container: z.any(),
  },
  handler: async ({ server_id, container_name }) => {
    try {
      const client = getKomodoClient();
      const container = await client.inspect_docker_container(server_id, container_name);
      return createToolResponse({ container });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Start Container
export const startContainerTool: ToolDefinition = {
  name: 'start_container',
  title: 'Start Container',
  description: 'Start a Docker container',
  inputSchema: {
    server_id: z.string().describe('Server ID'),
    container_name: z.string().describe('Container name'),
  },
  outputSchema: {
    update: z.any(),
  },
  handler: async ({ server_id, container_name }) => {
    try {
      const client = getKomodoClient();
      const update = await client.start_container(server_id, container_name);
      return createToolResponse({ update });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Stop Container
export const stopContainerTool: ToolDefinition = {
  name: 'stop_container',
  title: 'Stop Container',
  description: 'Stop a Docker container',
  inputSchema: {
    server_id: z.string().describe('Server ID'),
    container_name: z.string().describe('Container name'),
  },
  outputSchema: {
    update: z.any(),
  },
  handler: async ({ server_id, container_name }) => {
    try {
      const client = getKomodoClient();
      const update = await client.stop_container(server_id, container_name);
      return createToolResponse({ update });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Restart Container
export const restartContainerTool: ToolDefinition = {
  name: 'restart_container',
  title: 'Restart Container',
  description: 'Restart a Docker container',
  inputSchema: {
    server_id: z.string().describe('Server ID'),
    container_name: z.string().describe('Container name'),
  },
  outputSchema: {
    update: z.any(),
  },
  handler: async ({ server_id, container_name }) => {
    try {
      const client = getKomodoClient();
      const update = await client.restart_container(server_id, container_name);
      return createToolResponse({ update });
    } catch (error) {
      return handleToolError(error);
    }
  },
};
