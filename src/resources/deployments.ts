import { getKomodoClient, formatResponse, handleError } from '../client.js';
import { ToolDefinition, ToolHandler, ResourceModule } from '../types.js';

const tools: ToolDefinition[] = [
  {
    name: 'list_deployments',
    description: 'Lista todos los deployments disponibles en Komodo',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_deployment_info',
    description: 'Obtiene información detallada de un deployment específico',
    inputSchema: {
      type: 'object',
      properties: {
        deployment_name: {
          type: 'string',
          description: 'Nombre del deployment',
        },
      },
      required: ['deployment_name'],
    },
  },
  {
    name: 'deploy_deployment',
    description: 'Despliega un deployment específico',
    inputSchema: {
      type: 'object',
      properties: {
        deployment_name: {
          type: 'string',
          description: 'Nombre del deployment a desplegar',
        },
        stop_time: {
          type: 'string',
          description: 'Tiempo de parada opcional (ISO 8601)',
        },
      },
      required: ['deployment_name'],
    },
  },
  {
    name: 'create_deployment',
    description: 'Crea un nuevo deployment en Komodo',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Nombre del deployment',
        },
        server_id: {
          type: 'string',
          description: 'ID del servidor donde desplegar',
        },
        image: {
          type: 'object',
          description: 'Configuración de la imagen Docker',
          properties: {
            type: {
              type: 'string',
              enum: ['Image', 'Build'],
              description: 'Tipo de imagen (Image para imagen directa, Build para build)',
            },
            params: {
              type: 'object',
              description: 'Parámetros específicos del tipo de imagen',
            },
          },
          required: ['type'],
        },
        environment: {
          type: 'object',
          description: 'Variables de entorno para el deployment',
        },
        volumes: {
          type: 'array',
          items: { type: 'string' },
          description: 'Volúmenes a montar (formato: host_path:container_path)',
        },
        ports: {
          type: 'array',
          items: { type: 'string' },
          description: 'Puertos a exponer (formato: host_port:container_port)',
        },
        labels: {
          type: 'object',
          description: 'Labels Docker para el contenedor',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags para el deployment',
        },
      },
      required: ['name', 'server_id', 'image'],
    },
  },
  {
    name: 'update_deployment',
    description: 'Actualiza la configuración de un deployment existente',
    inputSchema: {
      type: 'object',
      properties: {
        deployment_id: {
          type: 'string',
          description: 'ID del deployment a actualizar',
        },
        config: {
          type: 'object',
          description: 'Nueva configuración del deployment',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Nuevos tags para el deployment',
        },
      },
      required: ['deployment_id'],
    },
  },
  {
    name: 'delete_deployment',
    description: 'Elimina un deployment de Komodo',
    inputSchema: {
      type: 'object',
      properties: {
        deployment_id: {
          type: 'string',
          description: 'ID del deployment a eliminar',
        },
      },
      required: ['deployment_id'],
    },
  },
  {
    name: 'stop_deployment',
    description: 'Detiene un deployment en ejecución',
    inputSchema: {
      type: 'object',
      properties: {
        deployment_name: {
          type: 'string',
          description: 'Nombre del deployment a detener',
        },
      },
      required: ['deployment_name'],
    },
  },
  {
    name: 'start_deployment',
    description: 'Inicia un deployment detenido',
    inputSchema: {
      type: 'object',
      properties: {
        deployment_name: {
          type: 'string',
          description: 'Nombre del deployment a iniciar',
        },
      },
      required: ['deployment_name'],
    },
  },
  {
    name: 'restart_deployment',
    description: 'Reinicia un deployment',
    inputSchema: {
      type: 'object',
      properties: {
        deployment_name: {
          type: 'string',
          description: 'Nombre del deployment a reiniciar',
        },
      },
      required: ['deployment_name'],
    },
  },
  {
    name: 'get_deployment_logs',
    description: 'Obtiene los logs de un deployment',
    inputSchema: {
      type: 'object',
      properties: {
        deployment_name: {
          type: 'string',
          description: 'Nombre del deployment',
        },
        tail: {
          type: 'number',
          description: 'Número de líneas desde el final',
          default: 100,
        },
      },
      required: ['deployment_name'],
    },
  },
];

const handlers: Record<string, ToolHandler> = {
  list_deployments: async () => {
    try {
      const komodo = getKomodoClient();
      const deployments = await komodo.read('ListDeployments', {});
      return {
        content: [{
          type: 'text',
          text: formatResponse(deployments),
        }],
      };
    } catch (error) {
      handleError('list_deployments', error);
    }
  },

  get_deployment_info: async (args: { deployment_name: string }) => {
    try {
      const komodo = getKomodoClient();
      const deploymentInfo = await komodo.read('GetDeployment', { deployment: args.deployment_name });
      return {
        content: [{
          type: 'text',
          text: formatResponse(deploymentInfo),
        }],
      };
    } catch (error) {
      handleError('get_deployment_info', error);
    }
  },

  deploy_deployment: async (args: { deployment_name: string; stop_time?: string }) => {
    try {
      const komodo = getKomodoClient();
      const deployParams: any = { deployment: args.deployment_name };
      if (args.stop_time) {
        deployParams.stop_time = args.stop_time;
      }
      const update = await komodo.execute('Deploy', deployParams);
      return {
        content: [{
          type: 'text',
          text: formatResponse(update, `Deployment '${args.deployment_name}' desplegado exitosamente.`),
        }],
      };
    } catch (error) {
      handleError('deploy_deployment', error);
    }
  },

  create_deployment: async (args: any) => {
    try {
      const komodo = getKomodoClient();
      const deploymentConfig: any = {
        server_id: args.server_id,
        image: args.image,
      };
      
      if (args.environment) deploymentConfig.environment = args.environment;
      if (args.volumes) deploymentConfig.volumes = args.volumes;
      if (args.ports) deploymentConfig.ports = args.ports;
      if (args.labels) deploymentConfig.labels = args.labels;
      
      const deployment = await komodo.write('CreateDeployment', {
        name: args.name,
        config: deploymentConfig,
      });
      return {
        content: [{
          type: 'text',
          text: formatResponse(deployment, `Deployment '${args.name}' creado exitosamente.`),
        }],
      };
    } catch (error) {
      handleError('create_deployment', error);
    }
  },

  update_deployment: async (args: any) => {
    try {
      const komodo = getKomodoClient();
      const updateData: any = { id: args.deployment_id };
      
      if (args.config) updateData.config = args.config;
      if (args.tags !== undefined) updateData.tags = args.tags;
      
      const deployment = await komodo.write('UpdateDeployment', updateData);
      return {
        content: [{
          type: 'text',
          text: formatResponse(deployment, `Deployment '${args.deployment_id}' actualizado exitosamente.`),
        }],
      };
    } catch (error) {
      handleError('update_deployment', error);
    }
  },

  delete_deployment: async (args: { deployment_id: string }) => {
    try {
      const komodo = getKomodoClient();
      const result = await komodo.write('DeleteDeployment', { id: args.deployment_id });
      return {
        content: [{
          type: 'text',
          text: formatResponse(result, `Deployment '${args.deployment_id}' eliminado exitosamente.`),
        }],
      };
    } catch (error) {
      handleError('delete_deployment', error);
    }
  },

  stop_deployment: async (args: { deployment_name: string }) => {
    try {
      const komodo = getKomodoClient();
      const update = await komodo.execute('StopDeployment', { deployment: args.deployment_name });
      return {
        content: [{
          type: 'text',
          text: formatResponse(update, `Deployment '${args.deployment_name}' detenido exitosamente.`),
        }],
      };
    } catch (error) {
      handleError('stop_deployment', error);
    }
  },

  start_deployment: async (args: { deployment_name: string }) => {
    try {
      const komodo = getKomodoClient();
      const update = await komodo.execute('StartDeployment', { deployment: args.deployment_name });
      return {
        content: [{
          type: 'text',
          text: formatResponse(update, `Deployment '${args.deployment_name}' iniciado exitosamente.`),
        }],
      };
    } catch (error) {
      handleError('start_deployment', error);
    }
  },

  restart_deployment: async (args: { deployment_name: string }) => {
    try {
      const komodo = getKomodoClient();
      const update = await komodo.execute('RestartDeployment', { deployment: args.deployment_name });
      return {
        content: [{
          type: 'text',
          text: formatResponse(update, `Deployment '${args.deployment_name}' reiniciado exitosamente.`),
        }],
      };
    } catch (error) {
      handleError('restart_deployment', error);
    }
  },

  get_deployment_logs: async (args: { deployment_name: string; tail?: number }) => {
    try {
      const komodo = getKomodoClient();
      const logs = await komodo.read('GetDeploymentLog', { 
        deployment: args.deployment_name,
        tail: args.tail || 100,
      });
      return {
        content: [{
          type: 'text',
          text: formatResponse(logs, `Logs del deployment '${args.deployment_name}':`),
        }],
      };
    } catch (error) {
      handleError('get_deployment_logs', error);
    }
  },
};

export const deploymentsModule: ResourceModule = {
  getTools: () => tools,
  getHandlers: () => handlers,
};