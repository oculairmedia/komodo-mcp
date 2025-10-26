import { getKomodoClient, formatResponse, handleError } from '../client.js';
import { ToolDefinition, ToolHandler, ResourceModule } from '../types.js';

const tools: ToolDefinition[] = [
  {
    name: 'list_repos',
    description: 'Lista todos los repositorios disponibles en Komodo',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_repo_info',
    description: 'Obtiene información detallada de un repositorio específico',
    inputSchema: {
      type: 'object',
      properties: {
        repo_name: {
          type: 'string',
          description: 'Nombre del repositorio',
        },
      },
      required: ['repo_name'],
    },
  },
  {
    name: 'create_repo',
    description: 'Crea un nuevo repositorio en Komodo',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Nombre del repositorio',
        },
        git_provider: {
          type: 'string',
          description: 'Proveedor de Git (github, gitlab, etc.)',
        },
        git_account: {
          type: 'string',
          description: 'Cuenta de Git',
        },
        repo: {
          type: 'string',
          description: 'URL o nombre del repositorio',
        },
        branch: {
          type: 'string',
          description: 'Rama por defecto',
          default: 'main',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags para el repositorio',
        },
      },
      required: ['name', 'git_provider', 'git_account', 'repo'],
    },
  },
  {
    name: 'update_repo',
    description: 'Actualiza la configuración de un repositorio existente',
    inputSchema: {
      type: 'object',
      properties: {
        repo_id: {
          type: 'string',
          description: 'ID del repositorio a actualizar',
        },
        config: {
          type: 'object',
          description: 'Nueva configuración del repositorio',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Nuevos tags para el repositorio',
        },
      },
      required: ['repo_id'],
    },
  },
  {
    name: 'delete_repo',
    description: 'Elimina un repositorio de Komodo',
    inputSchema: {
      type: 'object',
      properties: {
        repo_id: {
          type: 'string',
          description: 'ID del repositorio a eliminar',
        },
      },
      required: ['repo_id'],
    },
  },
  {
    name: 'pull_repo',
    description: 'Actualiza un repositorio desde el origen remoto',
    inputSchema: {
      type: 'object',
      properties: {
        repo_name: {
          type: 'string',
          description: 'Nombre del repositorio a actualizar',
        },
      },
      required: ['repo_name'],
    },
  },
  {
    name: 'clone_repo',
    description: 'Clona un repositorio',
    inputSchema: {
      type: 'object',
      properties: {
        repo_name: {
          type: 'string',
          description: 'Nombre del repositorio a clonar',
        },
      },
      required: ['repo_name'],
    },
  },
];

const handlers: Record<string, ToolHandler> = {
  list_repos: async () => {
    try {
      const komodo = getKomodoClient();
      const repos = await komodo.read('ListRepos', {});
      return {
        content: [{
          type: 'text',
          text: formatResponse(repos),
        }],
      };
    } catch (error) {
      throw handleError('list_repos', error);
    }
  },

  get_repo_info: async (args: { repo_name: string }) => {
    try {
      const komodo = getKomodoClient();
      const repoInfo = await komodo.read('GetRepo', { repo: args.repo_name });
      return {
        content: [{
          type: 'text',
          text: formatResponse(repoInfo),
        }],
      };
    } catch (error) {
      throw handleError('get_repo_info', error);
    }
  },

  create_repo: async (args: any) => {
    try {
      const komodo = getKomodoClient();
      const repoConfig: any = {
        git_provider: args.git_provider,
        git_account: args.git_account,
        repo: args.repo,
        branch: args.branch || 'main',
      };
      
      const repo = await komodo.write('CreateRepo', {
        name: args.name,
        config: repoConfig,
      });
      return {
        content: [{
          type: 'text',
          text: formatResponse(repo, `Repositorio '${args.name}' creado exitosamente.`),
        }],
      };
    } catch (error) {
      throw handleError('create_repo', error);
    }
  },

  update_repo: async (args: any) => {
    try {
      const komodo = getKomodoClient();
      const updateData: any = { id: args.repo_id };
      
      if (args.config) updateData.config = args.config;
      if (args.tags !== undefined) updateData.tags = args.tags;
      
      const repo = await komodo.write('UpdateRepo', updateData);
      return {
        content: [{
          type: 'text',
          text: formatResponse(repo, `Repositorio '${args.repo_id}' actualizado exitosamente.`),
        }],
      };
    } catch (error) {
      throw handleError('update_repo', error);
    }
  },

  delete_repo: async (args: { repo_id: string }) => {
    try {
      const komodo = getKomodoClient();
      const result = await komodo.write('DeleteRepo', { id: args.repo_id });
      return {
        content: [{
          type: 'text',
          text: formatResponse(result, `Repositorio '${args.repo_id}' eliminado exitosamente.`),
        }],
      };
    } catch (error) {
      throw handleError('delete_repo', error);
    }
  },

  pull_repo: async (args: { repo_name: string }) => {
    try {
      const komodo = getKomodoClient();
      const update = await komodo.execute('PullRepo', { repo: args.repo_name });
      return {
        content: [{
          type: 'text',
          text: formatResponse(update, `Repositorio '${args.repo_name}' actualizado exitosamente.`),
        }],
      };
    } catch (error) {
      throw handleError('pull_repo', error);
    }
  },

  clone_repo: async (args: { repo_name: string }) => {
    try {
      const komodo = getKomodoClient();
      const update = await komodo.execute('CloneRepo', { repo: args.repo_name });
      return {
        content: [{
          type: 'text',
          text: formatResponse(update, `Repositorio '${args.repo_name}' clonado exitosamente.`),
        }],
      };
    } catch (error) {
      throw handleError('clone_repo', error);
    }
  },
};

export const reposModule: ResourceModule = {
  getTools: () => tools,
  getHandlers: () => handlers,
};