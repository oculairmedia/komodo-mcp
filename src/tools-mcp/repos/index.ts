import { z } from 'zod';
import { ToolDefinition, createToolResponse, handleToolError } from '../types.js';
import { getKomodoClient } from '../../tools/komodo-client.js';

// List Repos
export const listReposTool: ToolDefinition = {
  name: 'list_repos',
  title: 'List Repos',
  description: 'List all available repositories in Komodo',
  inputSchema: {},
  outputSchema: {
    repos: z.array(z.any()),
  },
  handler: async () => {
    try {
      const client = getKomodoClient();
      const repos = await client.list_repos({});
      return createToolResponse({ repos });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Get Repo
export const getRepoTool: ToolDefinition = {
  name: 'get_repo',
  title: 'Get Repo',
  description: 'Get detailed information about a specific repository',
  inputSchema: {
    repo_id: z.string().describe('Repository ID'),
  },
  outputSchema: {
    repo: z.any(),
  },
  handler: async ({ repo_id }) => {
    try {
      const client = getKomodoClient();
      const repo = await client.get_repo(repo_id);
      return createToolResponse({ repo });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Clone Repo
export const cloneRepoTool: ToolDefinition = {
  name: 'clone_repo',
  title: 'Clone Repo',
  description: 'Clone a repository',
  inputSchema: {
    repo_id: z.string().describe('Repository ID a clonar'),
  },
  outputSchema: {
    update: z.any(),
  },
  handler: async ({ repo_id }) => {
    try {
      const client = getKomodoClient();
      const update = await client.clone_repo(repo_id);
      return createToolResponse({ update });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Pull Repo
export const pullRepoTool: ToolDefinition = {
  name: 'pull_repo',
  title: 'Pull Repo',
  description: 'Update a repository (git pull)',
  inputSchema: {
    repo_id: z.string().describe('Repository ID a actualizar'),
  },
  outputSchema: {
    update: z.any(),
  },
  handler: async ({ repo_id }) => {
    try {
      const client = getKomodoClient();
      const update = await client.pull_repo(repo_id);
      return createToolResponse({ update });
    } catch (error) {
      return handleToolError(error);
    }
  },
};

// Delete Repo
export const deleteRepoTool: ToolDefinition = {
  name: 'delete_repo',
  title: 'Delete Repo',
  description: 'Delete a repository from Komodo',
  inputSchema: {
    repo_id: z.string().describe('Repository ID a eliminar'),
  },
  outputSchema: {
    success: z.boolean(),
    message: z.string(),
  },
  handler: async ({ repo_id }) => {
    try {
      const client = getKomodoClient();
      await client.delete_repo(repo_id);
      return createToolResponse({
        success: true,
        message: `Repo ${repo_id} deleted successfully`
      });
    } catch (error) {
      return handleToolError(error);
    }
  },
};
