import { getKomodoClient, formatResponse, handleError } from '../client.js';
import { ToolDefinition, ToolHandler, ResourceModule } from '../types.js';

const tools: ToolDefinition[] = [
  {
    name: 'list_builds',
    description: 'Lista todos los builds disponibles en Komodo',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_build_info',
    description: 'Obtiene información detallada de un build específico',
    inputSchema: {
      type: 'object',
      properties: {
        build_name: {
          type: 'string',
          description: 'Nombre del build',
        },
      },
      required: ['build_name'],
    },
  },
  {
    name: 'run_build',
    description: 'Ejecuta un build específico',
    inputSchema: {
      type: 'object',
      properties: {
        build_name: {
          type: 'string',
          description: 'Nombre del build a ejecutar',
        },
      },
      required: ['build_name'],
    },
  },
  {
    name: 'create_build',
    description: 'Crea un nuevo build en Komodo',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Nombre del build',
        },
        builder_id: {
          type: 'string',
          description: 'ID del builder a utilizar',
        },
        repo: {
          type: 'string',
          description: 'Repositorio del código fuente',
        },
        branch: {
          type: 'string',
          description: 'Rama del repositorio',
          default: 'main',
        },
        dockerfile_path: {
          type: 'string',
          description: 'Ruta al Dockerfile',
          default: 'Dockerfile',
        },
        build_args: {
          type: 'object',
          description: 'Argumentos de build para Docker',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags para el build',
        },
      },
      required: ['name', 'builder_id', 'repo'],
    },
  },
  {
    name: 'update_build',
    description: 'Actualiza la configuración de un build existente',
    inputSchema: {
      type: 'object',
      properties: {
        build_id: {
          type: 'string',
          description: 'ID del build a actualizar',
        },
        config: {
          type: 'object',
          description: 'Nueva configuración del build',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Nuevos tags para el build',
        },
      },
      required: ['build_id'],
    },
  },
  {
    name: 'delete_build',
    description: 'Elimina un build de Komodo',
    inputSchema: {
      type: 'object',
      properties: {
        build_id: {
          type: 'string',
          description: 'ID del build a eliminar',
        },
      },
      required: ['build_id'],
    },
  },
  {
    name: 'cancel_build',
    description: 'Cancela un build en ejecución',
    inputSchema: {
      type: 'object',
      properties: {
        build_name: {
          type: 'string',
          description: 'Nombre del build a cancelar',
        },
      },
      required: ['build_name'],
    },
  },

];

const handlers: Record<string, ToolHandler> = {
  list_builds: async () => {
    try {
      const komodo = getKomodoClient();
      const builds = await komodo.read('ListBuilds', {});
      return {
        content: [{
          type: 'text',
          text: formatResponse(builds),
        }],
      };
    } catch (error) {
      handleError('list_builds', error);
    }
  },

  get_build_info: async (args: { build_name: string }) => {
    try {
      const komodo = getKomodoClient();
      const buildInfo = await komodo.read('GetBuild', { build: args.build_name });
      return {
        content: [{
          type: 'text',
          text: formatResponse(buildInfo),
        }],
      };
    } catch (error) {
      handleError('get_build_info', error);
    }
  },

  run_build: async (args: { build_name: string }) => {
    try {
      const komodo = getKomodoClient();
      const update = await komodo.execute('RunBuild', { build: args.build_name });
      return {
        content: [{
          type: 'text',
          text: formatResponse(update, `Build '${args.build_name}' ejecutado exitosamente.`),
        }],
      };
    } catch (error) {
      handleError('run_build', error);
    }
  },

  create_build: async (args: any) => {
    try {
      const komodo = getKomodoClient();
      const buildConfig: any = {
        builder_id: args.builder_id,
        repo: args.repo,
        branch: args.branch || 'main',
        dockerfile_path: args.dockerfile_path || 'Dockerfile',
      };
      
      if (args.build_args) buildConfig.build_args = args.build_args;
      
      const build = await komodo.write('CreateBuild', {
        name: args.name,
        config: buildConfig,
      });
      return {
        content: [{
          type: 'text',
          text: formatResponse(build, `Build '${args.name}' creado exitosamente.`),
        }],
      };
    } catch (error) {
      handleError('create_build', error);
    }
  },

  update_build: async (args: any) => {
    try {
      const komodo = getKomodoClient();
      const updateData: any = { id: args.build_id };
      
      if (args.config) updateData.config = args.config;
      if (args.tags !== undefined) updateData.tags = args.tags;
      
      const build = await komodo.write('UpdateBuild', updateData);
      return {
        content: [{
          type: 'text',
          text: formatResponse(build, `Build '${args.build_id}' actualizado exitosamente.`),
        }],
      };
    } catch (error) {
      handleError('update_build', error);
    }
  },

  delete_build: async (args: { build_id: string }) => {
    try {
      const komodo = getKomodoClient();
      const result = await komodo.write('DeleteBuild', { id: args.build_id });
      return {
        content: [{
          type: 'text',
          text: formatResponse(result, `Build '${args.build_id}' eliminado exitosamente.`),
        }],
      };
    } catch (error) {
      handleError('delete_build', error);
    }
  },

  cancel_build: async (args: { build_name: string }) => {
    try {
      const komodo = getKomodoClient();
      const update = await komodo.execute('CancelBuild', { build: args.build_name });
      return {
        content: [{
          type: 'text',
          text: formatResponse(update, `Build '${args.build_name}' cancelado exitosamente.`),
        }],
      };
    } catch (error) {
      handleError('cancel_build', error);
    }
  },


};

export const buildsModule: ResourceModule = {
  getTools: () => tools,
  getHandlers: () => handlers,
};