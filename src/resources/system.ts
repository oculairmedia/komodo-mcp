import { getKomodoClient, formatResponse, handleError } from '../client.js';
import { ToolDefinition, ToolHandler, ResourceModule } from '../types.js';

const tools: ToolDefinition[] = [
  {
    name: 'list_updates',
    description: 'Lista las actualizaciones recientes',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Número máximo de actualizaciones a mostrar',
          default: 10,
        },
      },
    },
  },
  {
    name: 'get_system_info',
    description: 'Obtiene información del sistema Komodo',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_version',
    description: 'Obtiene la versión del sistema Komodo',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'list_secrets',
    description: 'Lista todos los secretos disponibles',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  {
    name: 'list_alerters',
    description: 'Lista todos los alerters disponibles',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_alerter_info',
    description: 'Obtiene información detallada de un alerter específico',
    inputSchema: {
      type: 'object',
      properties: {
        alerter_name: {
          type: 'string',
          description: 'Nombre del alerter',
        },
      },
      required: ['alerter_name'],
    },
  },
  {
    name: 'create_alerter',
    description: 'Crea un nuevo alerter en Komodo',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Nombre del alerter',
        },
        webhook_url: {
          type: 'string',
          description: 'URL del webhook para las alertas',
        },
        enabled: {
          type: 'boolean',
          description: 'Si el alerter está habilitado',
          default: true,
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags para el alerter',
        },
      },
      required: ['name', 'webhook_url'],
    },
  },
  {
    name: 'update_alerter',
    description: 'Actualiza la configuración de un alerter existente',
    inputSchema: {
      type: 'object',
      properties: {
        alerter_id: {
          type: 'string',
          description: 'ID del alerter a actualizar',
        },
        config: {
          type: 'object',
          description: 'Nueva configuración del alerter',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Nuevos tags para el alerter',
        },
      },
      required: ['alerter_id'],
    },
  },
  {
    name: 'delete_alerter',
    description: 'Elimina un alerter de Komodo',
    inputSchema: {
      type: 'object',
      properties: {
        alerter_id: {
          type: 'string',
          description: 'ID del alerter a eliminar',
        },
      },
      required: ['alerter_id'],
    },
  },
];

const handlers: Record<string, ToolHandler> = {
  list_updates: async (args: { limit?: number }) => {
    try {
      const komodo = getKomodoClient();
      const updates = await komodo.read('ListUpdates', {});
      return {
        content: [{
          type: 'text',
          text: formatResponse(updates),
        }],
      };
    } catch (error) {
      handleError('list_updates', error);
    }
  },

  get_system_info: async () => {
    try {
      const komodo = getKomodoClient();
      const systemInfo = await komodo.read('GetCoreInfo', {});
      return {
        content: [{
          type: 'text',
          text: formatResponse(systemInfo),
        }],
      };
    } catch (error) {
      handleError('get_system_info', error);
    }
  },

  get_version: async () => {
    try {
      const komodo = getKomodoClient();
      const version = await komodo.read('GetVersion', {});
      return {
        content: [{
          type: 'text',
          text: formatResponse(version),
        }],
      };
    } catch (error) {
      handleError('get_version', error);
    }
  },

  list_secrets: async () => {
    try {
      const komodo = getKomodoClient();
      const secrets = await komodo.read('ListSecrets', {});
      return {
        content: [{
          type: 'text',
          text: formatResponse(secrets),
        }],
      };
    } catch (error) {
      handleError('list_secrets', error);
    }
  },



  list_alerters: async () => {
    try {
      const komodo = getKomodoClient();
      const alerters = await komodo.read('ListAlerters', {});
      return {
        content: [{
          type: 'text',
          text: formatResponse(alerters),
        }],
      };
    } catch (error) {
      handleError('list_alerters', error);
    }
  },

  get_alerter_info: async (args: { alerter_name: string }) => {
    try {
      const komodo = getKomodoClient();
      const alerterInfo = await komodo.read('GetAlerter', { alerter: args.alerter_name });
      return {
        content: [{
          type: 'text',
          text: formatResponse(alerterInfo),
        }],
      };
    } catch (error) {
      handleError('get_alerter_info', error);
    }
  },

  create_alerter: async (args: any) => {
    try {
      const komodo = getKomodoClient();
      const alerterConfig: any = {
        webhook_url: args.webhook_url,
        enabled: args.enabled !== undefined ? args.enabled : true,
      };
      
      const alerter = await komodo.write('CreateAlerter', {
        name: args.name,
        config: alerterConfig,
      });
      return {
        content: [{
          type: 'text',
          text: formatResponse(alerter, `Alerter '${args.name}' creado exitosamente.`),
        }],
      };
    } catch (error) {
      handleError('create_alerter', error);
    }
  },

  update_alerter: async (args: any) => {
    try {
      const komodo = getKomodoClient();
      const updateData: any = { id: args.alerter_id };
      
      if (args.config) updateData.config = args.config;
      if (args.tags !== undefined) updateData.tags = args.tags;
      
      const alerter = await komodo.write('UpdateAlerter', updateData);
      return {
        content: [{
          type: 'text',
          text: formatResponse(alerter, `Alerter '${args.alerter_id}' actualizado exitosamente.`),
        }],
      };
    } catch (error) {
      handleError('update_alerter', error);
    }
  },

  delete_alerter: async (args: { alerter_id: string }) => {
    try {
      const komodo = getKomodoClient();
      const result = await komodo.write('DeleteAlerter', { id: args.alerter_id });
      return {
        content: [{
          type: 'text',
          text: formatResponse(result, `Alerter '${args.alerter_id}' eliminado exitosamente.`),
        }],
      };
    } catch (error) {
      handleError('delete_alerter', error);
    }
  },
};

export const systemModule: ResourceModule = {
  getTools: () => tools,
  getHandlers: () => handlers,
};