import { z } from 'zod';
import { ToolDefinition, createToolResponse, handleToolError } from '../types.js';
import { getKomodoClient } from '../../tools/komodo-client.js';

// List Deployments
export const listDeploymentsTool: ToolDefinition = {
  name: 'list_deployments',
  title: 'List Deployments',
  description: 'List all available deployments in Komodo',
  inputSchema: {},
  outputSchema: {
    deployments: z.array(z.any()),
  },
  handler: async () => {
    try {
      const client = getKomodoClient();
      const deployments = await client.list_deployments({});
      return createToolResponse({ deployments });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Get Deployment
export const getDeploymentTool: ToolDefinition = {
  name: 'get_deployment',
  title: 'Get Deployment',
  description: 'Get detailed information about a specific deployment',
  inputSchema: {
    deployment_id: z.string().describe('Deployment ID'),
  },
  outputSchema: {
    deployment: z.any(),
  },
  handler: async ({ deployment_id }) => {
    try {
      const client = getKomodoClient();
      const deployment = await client.get_deployment(deployment_id);
      return createToolResponse({ deployment });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Create Deployment
export const createDeploymentTool: ToolDefinition = {
  name: 'create_deployment',
  title: 'Create Deployment',
  description: 'Create a new deployment in Komodo',
  inputSchema: {
    name: z.string().describe('Deployment name'),
    server_id: z.string().describe('Server ID donde se desplegará'),
    image: z.string().describe('Docker image to deploy'),
    ports: z.array(z.string()).optional().describe('Ports to expose (e.g., ["8080:80"])'),
    volumes: z.array(z.string()).optional().describe('Volumes to mount'),
    environment: z.record(z.string()).optional().describe('Environment variables'),
    description: z.string().optional().describe('Deployment description'),
    tags: z.array(z.string()).optional().describe('Tags for the deployment'),
  },
  outputSchema: {
    deployment: z.any(),
  },
  handler: async (params) => {
    try {
      const client = getKomodoClient();
      const deployment = await client.create_deployment({
        name: params.name,
        config: {
          server_id: params.server_id,
          image: params.image,
          ports: params.ports,
          volumes: params.volumes,
          environment: params.environment,
        },
        description: params.description,
        tags: params.tags,
      });
      return createToolResponse({ deployment });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Deploy
export const deployTool: ToolDefinition = {
  name: 'deploy',
  title: 'Deploy',
  description: 'Deploy a deployment (execute deployment)',
  inputSchema: {
    deployment_id: z.string().describe('Deployment ID a desplegar'),
  },
  outputSchema: {
    update: z.any(),
  },
  handler: async ({ deployment_id }) => {
    try {
      const client = getKomodoClient();
      const update = await client.deploy(deployment_id);
      return createToolResponse({ update });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Start Deployment
export const startDeploymentTool: ToolDefinition = {
  name: 'start_deployment',
  title: 'Start Deployment',
  description: 'Start a stopped deployment',
  inputSchema: {
    deployment_id: z.string().describe('Deployment ID a iniciar'),
  },
  outputSchema: {
    update: z.any(),
  },
  handler: async ({ deployment_id }) => {
    try {
      const client = getKomodoClient();
      const update = await client.start_deployment(deployment_id);
      return createToolResponse({ update });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Stop Deployment
export const stopDeploymentTool: ToolDefinition = {
  name: 'stop_deployment',
  title: 'Stop Deployment',
  description: 'Stop a running deployment',
  inputSchema: {
    deployment_id: z.string().describe('Deployment ID a detener'),
  },
  outputSchema: {
    update: z.any(),
  },
  handler: async ({ deployment_id }) => {
    try {
      const client = getKomodoClient();
      const update = await client.stop_deployment(deployment_id);
      return createToolResponse({ update });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Restart Deployment
export const restartDeploymentTool: ToolDefinition = {
  name: 'restart_deployment',
  title: 'Restart Deployment',
  description: 'Restart a deployment',
  inputSchema: {
    deployment_id: z.string().describe('Deployment ID a reiniciar'),
  },
  outputSchema: {
    update: z.any(),
  },
  handler: async ({ deployment_id }) => {
    try {
      const client = getKomodoClient();
      const update = await client.restart_deployment(deployment_id);
      return createToolResponse({ update });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Delete Deployment
export const deleteDeploymentTool: ToolDefinition = {
  name: 'delete_deployment',
  title: 'Delete Deployment',
  description: 'Delete a deployment from Komodo',
  inputSchema: {
    deployment_id: z.string().describe('Deployment ID a eliminar'),
  },
  outputSchema: {
    success: z.boolean(),
    message: z.string(),
  },
  handler: async ({ deployment_id }) => {
    try {
      const client = getKomodoClient();
      await client.delete_deployment(deployment_id);
      return createToolResponse({
        success: true,
        message: `Deployment ${deployment_id} deleted successfully`
      });
    } catch (error) {
      return handleToolError(error);
    }
  },
};
