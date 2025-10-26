import { getKomodoClient, formatResponse, handleError } from '../client.js';
import { ToolDefinition, ToolHandler, ResourceModule } from '../types.js';

const tools: ToolDefinition[] = [
  {
    name: 'list_stacks',
    description: 'Lista todos los stacks disponibles en Komodo',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_stack_info',
    description: 'Obtiene información detallada de un stack específico',
    inputSchema: {
      type: 'object',
      properties: {
        stack_name: {
          type: 'string',
          description: 'Nombre del stack',
        },
      },
      required: ['stack_name'],
    },
  },
  {
    name: 'deploy_stack',
    description: 'Despliega un stack específico',
    inputSchema: {
      type: 'object',
      properties: {
        stack_name: {
          type: 'string',
          description: 'Nombre del stack a desplegar',
        },
        stop_time: {
          type: 'string',
          description: 'Tiempo de parada opcional (ISO 8601)',
        },
      },
      required: ['stack_name'],
    },
  },
  {
    name: 'create_stack',
    description: 'Crea un nuevo stack en Komodo',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Nombre del stack',
        },
        server_id: {
          type: 'string',
          description: 'ID del servidor donde desplegar el stack',
        },
        file_paths: {
          type: 'array',
          items: { type: 'string' },
          description: 'Rutas de archivos compose',
        },
        git_provider: {
          type: 'string',
          description: 'Proveedor de git (ej: github.com)',
        },
        git_account: {
          type: 'string',
          description: 'Cuenta de git',
        },
        repo: {
          type: 'string',
          description: 'Repositorio (ej: usuario/repo)',
        },
        branch: {
          type: 'string',
          description: 'Rama del repositorio',
          default: 'main',
        },
        environment: {
          type: 'object',
          description: 'Variables de entorno para el stack',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags para el stack',
        },
      },
      required: ['name', 'server_id'],
    },
  },
  {
    name: 'update_stack',
    description: 'Actualiza la configuración de un stack existente',
    inputSchema: {
      type: 'object',
      properties: {
        stack_id: {
          type: 'string',
          description: 'ID del stack a actualizar',
        },
        config: {
          type: 'object',
          description: 'Nueva configuración del stack',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Nuevos tags para el stack',
        },
      },
      required: ['stack_id'],
    },
  },
  {
    name: 'delete_stack',
    description: 'Elimina un stack de Komodo',
    inputSchema: {
      type: 'object',
      properties: {
        stack_id: {
          type: 'string',
          description: 'ID del stack a eliminar',
        },
      },
      required: ['stack_id'],
    },
  },
  {
    name: 'stop_stack',
    description: 'Detiene un stack en ejecución',
    inputSchema: {
      type: 'object',
      properties: {
        stack_name: {
          type: 'string',
          description: 'Nombre del stack a detener',
        },
      },
      required: ['stack_name'],
    },
  },
  {
    name: 'start_stack',
    description: 'Inicia un stack detenido',
    inputSchema: {
      type: 'object',
      properties: {
        stack_name: {
          type: 'string',
          description: 'Nombre del stack a iniciar',
        },
      },
      required: ['stack_name'],
    },
  },
  {
    name: 'restart_stack',
    description: 'Reinicia un stack',
    inputSchema: {
      type: 'object',
      properties: {
        stack_name: {
          type: 'string',
          description: 'Nombre del stack a reiniciar',
        },
      },
      required: ['stack_name'],
    },
  },
];

const handlers: Record<string, ToolHandler> = {
  list_stacks: async () => {
    try {
      const komodo = getKomodoClient();
      const stacks = await komodo.read('ListStacks', {});
      return {
        content: [{
          type: 'text',
          text: formatResponse(stacks),
        }],
      };
    } catch (error) {
      throw handleError('list_stacks', error);
    }
  },

  get_stack_info: async (args: { stack_name: string }) => {
    try {
      const komodo = getKomodoClient();
      const stackInfo = await komodo.read('GetStack', { stack: args.stack_name });
      return {
        content: [{
          type: 'text',
          text: formatResponse(stackInfo),
        }],
      };
    } catch (error) {
      throw handleError('get_stack_info', error);
    }
  },

  deploy_stack: async (args: { stack_name: string; stop_time?: string }) => {
    try {
      const komodo = getKomodoClient();
      const deployParams: any = { stack: args.stack_name };
      if (args.stop_time) {
        deployParams.stop_time = args.stop_time;
      }
      const update = await komodo.execute('DeployStack', deployParams);
      return {
        content: [{
          type: 'text',
          text: formatResponse(update, `Stack '${args.stack_name}' desplegado exitosamente.`),
        }],
      };
    } catch (error) {
      throw handleError('deploy_stack', error);
    }
  },

  create_stack: async (args: any) => {
    try {
      const komodo = getKomodoClient();
      const stackConfig: any = {
        server_id: args.server_id,
      };
      
      if (args.file_paths) stackConfig.file_paths = args.file_paths;
      if (args.git_provider) stackConfig.git_provider = args.git_provider;
      if (args.git_account) stackConfig.git_account = args.git_account;
      if (args.repo) stackConfig.repo = args.repo;
      if (args.branch) stackConfig.branch = args.branch;
      if (args.environment) stackConfig.environment = args.environment;
      
      const stack = await komodo.write('CreateStack', {
        name: args.name,
        config: stackConfig,
      });
      return {
        content: [{
          type: 'text',
          text: formatResponse(stack, `Stack '${args.name}' creado exitosamente.`),
        }],
      };
    } catch (error) {
      throw handleError('create_stack', error);
    }
  },

  update_stack: async (args: any) => {
    try {
      const komodo = getKomodoClient();
      const updateData: any = { id: args.stack_id };
      
      if (args.config) updateData.config = args.config;
      if (args.tags !== undefined) updateData.tags = args.tags;
      
      const stack = await komodo.write('UpdateStack', updateData);
      return {
        content: [{
          type: 'text',
          text: formatResponse(stack, `Stack '${args.stack_id}' actualizado exitosamente.`),
        }],
      };
    } catch (error) {
      throw handleError('update_stack', error);
    }
  },

  delete_stack: async (args: { stack_id: string }) => {
    try {
      const komodo = getKomodoClient();
      const result = await komodo.write('DeleteStack', { id: args.stack_id });
      return {
        content: [{
          type: 'text',
          text: formatResponse(result, `Stack '${args.stack_id}' eliminado exitosamente.`),
        }],
      };
    } catch (error) {
      throw handleError('delete_stack', error);
    }
  },

  stop_stack: async (args: { stack_name: string }) => {
    try {
      const komodo = getKomodoClient();
      const update = await komodo.execute('StopStack', { stack: args.stack_name });
      return {
        content: [{
          type: 'text',
          text: formatResponse(update, `Stack '${args.stack_name}' detenido exitosamente.`),
        }],
      };
    } catch (error) {
      throw handleError('stop_stack', error);
    }
  },

  start_stack: async (args: { stack_name: string }) => {
    try {
      const komodo = getKomodoClient();
      const update = await komodo.execute('StartStack', { stack: args.stack_name });
      return {
        content: [{
          type: 'text',
          text: formatResponse(update, `Stack '${args.stack_name}' iniciado exitosamente.`),
        }],
      };
    } catch (error) {
      throw handleError('start_stack', error);
    }
  },

  restart_stack: async (args: { stack_name: string }) => {
    try {
      const komodo = getKomodoClient();
      const update = await komodo.execute('RestartStack', { stack: args.stack_name });
      return {
        content: [{
          type: 'text',
          text: formatResponse(update, `Stack '${args.stack_name}' reiniciado exitosamente.`),
        }],
      };
    } catch (error) {
      throw handleError('restart_stack', error);
    }
  },
};

export const stacksModule: ResourceModule = {
  getTools: () => tools,
  getHandlers: () => handlers,
};