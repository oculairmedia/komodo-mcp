import { z } from 'zod';
import { ConsolidatedToolDefinition, createToolResponse, handleToolError } from './types.js';
import { getKomodoClient } from '../tools/komodo-client.js';

const OPERATIONS = [
  'list',
  'get',
  'create',
  'deploy',
  'start',
  'stop',
  'restart',
  'delete'
] as const;

const inputSchema = {
  operation: z.enum(OPERATIONS).describe('Operation to perform'),

  // Common parameters
  deployment_id: z.string().optional().describe('Deployment ID (required for get, deploy, start, stop, restart, delete)'),

  // Create parameters
  name: z.string().optional().describe('Deployment name (required for create)'),
  server_id: z.string().optional().describe('Server ID (required for create)'),
  image: z.string().optional().describe('Docker image (required for create)'),
  restart_mode: z.string().optional().describe('Restart mode (e.g., "unless-stopped")'),
  network: z.string().optional().describe('Docker network'),
  ports: z.array(z.object({
    local: z.string(),
    container: z.string(),
  })).optional().describe('Port mappings'),
  volumes: z.array(z.object({
    local: z.string(),
    container: z.string(),
  })).optional().describe('Volume mounts'),
  environment: z.array(z.object({
    variable: z.string(),
    value: z.string(),
  })).optional().describe('Environment variables'),
  labels: z.record(z.string()).optional().describe('Docker labels'),
  description: z.string().optional().describe('Deployment description'),
  tags: z.array(z.string()).optional().describe('Tags for the deployment'),
};

export const komodoDeploymentOps: ConsolidatedToolDefinition = {
  name: 'komodo_deployment_ops',
  title: 'Komodo Deployment Operations',
  description: 'Deployment management hub - Supports 8 operations: list (all deployments), get (deployment details), create (new deployment), deploy (deploy container), start (start deployment), stop (stop deployment), restart (restart deployment), delete (remove deployment)',
  operations: [...OPERATIONS],
  inputSchema,
  handler: async (params) => {
    try {
      const client = getKomodoClient();
      const { operation } = params;

      switch (operation) {
        case 'list': {
          const deployments = await client.read('ListDeployments', {});
          return createToolResponse({ deployments });
        }

        case 'get': {
          if (!params.deployment_id) {
            throw new Error('deployment_id is required for get operation');
          }
          const deployment = await client.read('GetDeployment', { deployment: params.deployment_id });
          return createToolResponse({ deployment });
        }

        case 'create': {
          if (!params.name || !params.server_id || !params.image) {
            throw new Error('name, server_id, and image are required for create operation');
          }
          const deployment = await client.write('CreateDeployment', {
            name: params.name,
            config: {
              server_id: params.server_id,
              image: params.image,
              restart: params.restart_mode || 'unless-stopped',
              network: params.network,
              ports: params.ports,
              volumes: params.volumes,
              environment: params.environment,
              labels: params.labels,
            },
            description: params.description,
            tags: params.tags,
          });
          return createToolResponse({ deployment });
        }

        case 'deploy': {
          if (!params.deployment_id) {
            throw new Error('deployment_id is required for deploy operation');
          }
          const result = await client.execute('Deploy', { deployment: params.deployment_id });
          return createToolResponse({ result });
        }

        case 'start': {
          if (!params.deployment_id) {
            throw new Error('deployment_id is required for start operation');
          }
          const result = await client.execute('StartDeployment', { deployment: params.deployment_id });
          return createToolResponse({ result });
        }

        case 'stop': {
          if (!params.deployment_id) {
            throw new Error('deployment_id is required for stop operation');
          }
          const result = await client.execute('StopDeployment', { deployment: params.deployment_id });
          return createToolResponse({ result });
        }

        case 'restart': {
          if (!params.deployment_id) {
            throw new Error('deployment_id is required for restart operation');
          }
          const result = await client.execute('RestartDeployment', { deployment: params.deployment_id });
          return createToolResponse({ result });
        }

        case 'delete': {
          if (!params.deployment_id) {
            throw new Error('deployment_id is required for delete operation');
          }
          const result = await client.write('DeleteDeployment', { id: params.deployment_id });
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
