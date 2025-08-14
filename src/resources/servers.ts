import { getKomodoClient, formatResponse, handleError } from '../client.js';
import { ToolDefinition, ToolHandler, ResourceModule } from '../types.js';

const tools: ToolDefinition[] = [
  {
    name: 'list_servers',
    description: 'Lista todos los servidores disponibles en Komodo',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_server_info',
    description: 'Obtiene información detallada de un servidor específico',
    inputSchema: {
      type: 'object',
      properties: {
        server_id: {
          type: 'string',
          description: 'ID del servidor',
        },
      },
      required: ['server_id'],
    },
  },
  {
    name: 'create_server',
    description: 'Crea un nuevo servidor en Komodo',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Nombre del servidor',
        },
        address: {
          type: 'string',
          description: 'Dirección del servidor (ej: http://localhost:8120)',
        },
        region: {
          type: 'string',
          description: 'Región del servidor',
        },
        enabled: {
          type: 'boolean',
          description: 'Si el servidor está habilitado',
          default: true,
        },
        description: {
          type: 'string',
          description: 'Descripción del servidor',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags para el servidor',
        },
      },
      required: ['name', 'address'],
    },
  },
  {
    name: 'update_server',
    description: 'Actualiza la configuración de un servidor existente',
    inputSchema: {
      type: 'object',
      properties: {
        server_id: {
          type: 'string',
          description: 'ID del servidor a actualizar',
        },
        config: {
          type: 'object',
          description: 'Nueva configuración del servidor',
          properties: {
            address: { type: 'string' },
            region: { type: 'string' },
            enabled: { type: 'boolean' },
          },
        },
        description: {
          type: 'string',
          description: 'Nueva descripción del servidor',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Nuevos tags para el servidor',
        },
      },
      required: ['server_id'],
    },
  },
  {
    name: 'delete_server',
    description: 'Elimina un servidor de Komodo',
    inputSchema: {
      type: 'object',
      properties: {
        server_id: {
          type: 'string',
          description: 'ID del servidor a eliminar',
        },
      },
      required: ['server_id'],
    },
  },
  {
    name: 'get_server_stats',
    description: 'Obtiene estadísticas de un servidor específico',
    inputSchema: {
      type: 'object',
      properties: {
        server_id: {
          type: 'string',
          description: 'ID del servidor',
        },
      },
      required: ['server_id'],
    },
  },
];

const handlers: Record<string, ToolHandler> = {
  list_servers: async () => {
    try {
      const komodo = getKomodoClient();
      const servers = await komodo.read('ListServers', {});
      return {
        content: [{
          type: 'text',
          text: formatResponse(servers),
        }],
      };
    } catch (error) {
      handleError('list_servers', error);
    }
  },

  get_server_info: async (args: { server_id: string }) => {
    try {
      const komodo = getKomodoClient();
      const serverInfo = await komodo.read('GetServer', { server: args.server_id });
      return {
        content: [{
          type: 'text',
          text: formatResponse(serverInfo),
        }],
      };
    } catch (error) {
      handleError('get_server_info', error);
    }
  },

  create_server: async (args: any) => {
    try {
      const komodo = getKomodoClient();
      const server = await komodo.write('CreateServer', {
        name: args.name,
        config: {
          address: args.address,
          region: args.region || '',
          enabled: args.enabled ?? true,
        },
      });
      return {
        content: [{
          type: 'text',
          text: formatResponse(server, `Servidor '${args.name}' creado exitosamente.`),
        }],
      };
    } catch (error) {
      handleError('create_server', error);
    }
  },

  update_server: async (args: any) => {
    try {
      const komodo = getKomodoClient();
      const updateData: any = { id: args.server_id };
      
      if (args.config) updateData.config = args.config;
      if (args.description !== undefined) updateData.description = args.description;
      if (args.tags !== undefined) updateData.tags = args.tags;
      
      const server = await komodo.write('UpdateServer', updateData);
      return {
        content: [{
          type: 'text',
          text: formatResponse(server, `Servidor '${args.server_id}' actualizado exitosamente.`),
        }],
      };
    } catch (error) {
      handleError('update_server', error);
    }
  },

  delete_server: async (args: { server_id: string }) => {
    try {
      const komodo = getKomodoClient();
      const result = await komodo.write('DeleteServer', { id: args.server_id });
      return {
        content: [{
          type: 'text',
          text: formatResponse(result, `Servidor '${args.server_id}' eliminado exitosamente.`),
        }],
      };
    } catch (error) {
      handleError('delete_server', error);
    }
  },

  get_server_stats: async (args: { server_id: string }) => {
    try {
      const komodo = getKomodoClient();
      const stats = await komodo.read('GetSystemStats', { server: args.server_id });
      return {
        content: [{
          type: 'text',
          text: formatResponse(stats, `Estadísticas del sistema (servidor: ${args.server_id})`),
        }],
      };
    } catch (error) {
      handleError('get_server_stats', error);
    }
  },
};

export const serversModule: ResourceModule = {
  getTools: () => tools,
  getHandlers: () => handlers,
};