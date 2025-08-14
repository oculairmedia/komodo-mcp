import { getKomodoClient, formatResponse, handleError } from '../client.js';
import { ToolDefinition, ToolHandler, ResourceModule } from '../types.js';

const tools: ToolDefinition[] = [
  {
    name: 'list_procedures',
    description: 'Lista todos los procedimientos disponibles en Komodo',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_procedure_info',
    description: 'Obtiene información detallada de un procedimiento específico',
    inputSchema: {
      type: 'object',
      properties: {
        procedure_name: {
          type: 'string',
          description: 'Nombre del procedimiento',
        },
      },
      required: ['procedure_name'],
    },
  },
  {
    name: 'run_procedure',
    description: 'Ejecuta un procedimiento específico',
    inputSchema: {
      type: 'object',
      properties: {
        procedure_name: {
          type: 'string',
          description: 'Nombre del procedimiento a ejecutar',
        },
      },
      required: ['procedure_name'],
    },
  },
  {
    name: 'create_procedure',
    description: 'Crea un nuevo procedimiento en Komodo',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Nombre del procedimiento',
        },
        stages: {
          type: 'array',
          description: 'Etapas del procedimiento',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Nombre de la etapa',
              },
              enabled: {
                type: 'boolean',
                description: 'Si la etapa está habilitada',
                default: true,
              },
              executions: {
                type: 'array',
                description: 'Ejecuciones de la etapa',
                items: {
                  type: 'object',
                  description: 'Configuración de ejecución',
                },
              },
            },
            required: ['name', 'executions'],
          },
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags para el procedimiento',
        },
      },
      required: ['name', 'stages'],
    },
  },
  {
    name: 'update_procedure',
    description: 'Actualiza la configuración de un procedimiento existente',
    inputSchema: {
      type: 'object',
      properties: {
        procedure_id: {
          type: 'string',
          description: 'ID del procedimiento a actualizar',
        },
        config: {
          type: 'object',
          description: 'Nueva configuración del procedimiento',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Nuevos tags para el procedimiento',
        },
      },
      required: ['procedure_id'],
    },
  },
  {
    name: 'delete_procedure',
    description: 'Elimina un procedimiento de Komodo',
    inputSchema: {
      type: 'object',
      properties: {
        procedure_id: {
          type: 'string',
          description: 'ID del procedimiento a eliminar',
        },
      },
      required: ['procedure_id'],
    },
  },
];

const handlers: Record<string, ToolHandler> = {
  list_procedures: async () => {
    try {
      const komodo = getKomodoClient();
      const procedures = await komodo.read('ListProcedures', {});
      return {
        content: [{
          type: 'text',
          text: formatResponse(procedures),
        }],
      };
    } catch (error) {
      handleError('list_procedures', error);
    }
  },

  get_procedure_info: async (args: { procedure_name: string }) => {
    try {
      const komodo = getKomodoClient();
      const procedureInfo = await komodo.read('GetProcedure', { procedure: args.procedure_name });
      return {
        content: [{
          type: 'text',
          text: formatResponse(procedureInfo),
        }],
      };
    } catch (error) {
      handleError('get_procedure_info', error);
    }
  },

  run_procedure: async (args: { procedure_name: string }) => {
    try {
      const komodo = getKomodoClient();
      const update = await komodo.execute('RunProcedure', { procedure: args.procedure_name });
      return {
        content: [{
          type: 'text',
          text: formatResponse(update, `Procedimiento '${args.procedure_name}' ejecutado exitosamente.`),
        }],
      };
    } catch (error) {
      handleError('run_procedure', error);
    }
  },

  create_procedure: async (args: any) => {
    try {
      const komodo = getKomodoClient();
      const procedureConfig: any = {
        stages: args.stages,
      };
      
      const procedure = await komodo.write('CreateProcedure', {
        name: args.name,
        config: procedureConfig,
      });
      return {
        content: [{
          type: 'text',
          text: formatResponse(procedure, `Procedimiento '${args.name}' creado exitosamente.`),
        }],
      };
    } catch (error) {
      handleError('create_procedure', error);
    }
  },

  update_procedure: async (args: any) => {
    try {
      const komodo = getKomodoClient();
      const updateData: any = { id: args.procedure_id };
      
      if (args.config) updateData.config = args.config;
      if (args.tags !== undefined) updateData.tags = args.tags;
      
      const procedure = await komodo.write('UpdateProcedure', updateData);
      return {
        content: [{
          type: 'text',
          text: formatResponse(procedure, `Procedimiento '${args.procedure_id}' actualizado exitosamente.`),
        }],
      };
    } catch (error) {
      handleError('update_procedure', error);
    }
  },

  delete_procedure: async (args: { procedure_id: string }) => {
    try {
      const komodo = getKomodoClient();
      const result = await komodo.write('DeleteProcedure', { id: args.procedure_id });
      return {
        content: [{
          type: 'text',
          text: formatResponse(result, `Procedimiento '${args.procedure_id}' eliminado exitosamente.`),
        }],
      };
    } catch (error) {
      handleError('delete_procedure', error);
    }
  },
};

export const proceduresModule: ResourceModule = {
  getTools: () => tools,
  getHandlers: () => handlers,
};