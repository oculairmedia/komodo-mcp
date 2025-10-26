import { z } from 'zod';
import { ConsolidatedToolDefinition, createToolResponse, handleToolError } from './types.js';
import { getKomodoClient } from '../tools/komodo-client.js';

const OPERATIONS = [
  'list',
  'get',
  'clone',
  'pull',
  'delete'
] as const;

const inputSchema = {
  operation: z.enum(OPERATIONS).describe('Operation to perform'),

  // Common parameters
  repo_id: z.string().optional().describe('Repository ID (required for get, pull, delete)'),

  // Clone parameters
  server_id: z.string().optional().describe('Server ID where to clone repo (required for clone)'),
  name: z.string().optional().describe('Repository name (required for clone)'),
  git_provider: z.string().optional().describe('Git provider (e.g., "github", "gitlab")'),
  git_account: z.string().optional().describe('Git account name'),
  repo: z.string().optional().describe('Repository name on git provider'),
  branch: z.string().optional().describe('Branch to clone (default: main)'),
  description: z.string().optional().describe('Repository description'),
  tags: z.array(z.string()).optional().describe('Tags for the repository'),
};

export const komodoRepoOps: ConsolidatedToolDefinition = {
  name: 'komodo_repo_ops',
  title: 'Komodo Repository Operations',
  description: 'Repository management hub - Supports 5 operations: list (all repos), get (repo details), clone (clone repo from git), pull (pull latest changes), delete (remove repo)',
  operations: [...OPERATIONS],
  inputSchema,
  handler: async (params) => {
    try {
      const client = getKomodoClient();
      const { operation } = params;

      switch (operation) {
        case 'list': {
          const repos = await client.read('ListRepos', {});
          return createToolResponse({ repos });
        }

        case 'get': {
          if (!params.repo_id) {
            throw new Error('repo_id is required for get operation');
          }
          const repo = await client.read('GetRepo', { repo: params.repo_id });
          return createToolResponse({ repo });
        }

        case 'clone': {
          if (!params.name || !params.server_id) {
            throw new Error('name and server_id are required for clone operation');
          }
          // First create the repo
          const repo = await client.write('CreateRepo', {
            name: params.name,
            config: {
              server_id: params.server_id,
              git_provider: params.git_provider || 'github.com',
              git_account: params.git_account || '',
              repo: params.repo,
              branch: params.branch || 'main',
            },
            description: params.description,
            tags: params.tags,
          });
          // Then clone it
          const cloneResult = await client.execute('CloneRepo', { repo: params.name });
          return createToolResponse({ repo, cloneResult });
        }

        case 'pull': {
          if (!params.repo_id) {
            throw new Error('repo_id is required for pull operation');
          }
          const result = await client.execute('PullRepo', { repo: params.repo_id });
          return createToolResponse({ result });
        }

        case 'delete': {
          if (!params.repo_id) {
            throw new Error('repo_id is required for delete operation');
          }
          const result = await client.write('DeleteRepo', { id: params.repo_id });
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
