import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
import { z } from 'zod';
import { getKomodoClient } from './tools/komodo-client.js';

// Create MCP server
const server = new McpServer({
  name: 'komodo-mcp-server',
  version: '2.0.0',
});

// Register list_servers tool
server.registerTool(
  'list_servers',
  {
    title: 'List Servers',
    description: 'Lista todos los servidores disponibles en Komodo',
    inputSchema: {},
    outputSchema: {
      servers: z.array(z.any()),
    },
  },
  async () => {
    try {
      const client = getKomodoClient();
      const servers = await client.list_servers({});

      const output = { servers };
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(output, null, 2),
          },
        ],
        structuredContent: output,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Register get_server_info tool
server.registerTool(
  'get_server_info',
  {
    title: 'Get Server Info',
    description: 'Obtiene información detallada de un servidor específico',
    inputSchema: {
      server_id: z.string().describe('ID del servidor'),
    },
    outputSchema: {
      server: z.any(),
    },
  },
  async ({ server_id }) => {
    try {
      const client = getKomodoClient();
      const server = await client.get_server(server_id);

      const output = { server };
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(output, null, 2),
          },
        ],
        structuredContent: output,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Register create_server tool
server.registerTool(
  'create_server',
  {
    title: 'Create Server',
    description: 'Crea un nuevo servidor en Komodo',
    inputSchema: {
      name: z.string().describe('Nombre del servidor'),
      address: z.string().describe('Dirección del servidor (ej: http://localhost:8120)'),
      region: z.string().optional().describe('Región del servidor'),
      enabled: z.boolean().optional().default(true).describe('Si el servidor está habilitado'),
      description: z.string().optional().describe('Descripción del servidor'),
      tags: z.array(z.string()).optional().describe('Tags para el servidor'),
    },
    outputSchema: {
      server: z.any(),
    },
  },
  async (params) => {
    try {
      const client = getKomodoClient();
      const server = await client.create_server({
        name: params.name,
        config: {
          address: params.address,
          region: params.region,
          enabled: params.enabled,
        },
        description: params.description,
        tags: params.tags,
      });

      const output = { server };
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(output, null, 2),
          },
        ],
        structuredContent: output,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Register update_server tool
server.registerTool(
  'update_server',
  {
    title: 'Update Server',
    description: 'Actualiza la configuración de un servidor existente',
    inputSchema: {
      server_id: z.string().describe('ID del servidor a actualizar'),
      address: z.string().optional().describe('Nueva dirección del servidor'),
      region: z.string().optional().describe('Nueva región del servidor'),
      enabled: z.boolean().optional().describe('Si el servidor está habilitado'),
      description: z.string().optional().describe('Nueva descripción del servidor'),
      tags: z.array(z.string()).optional().describe('Nuevos tags para el servidor'),
    },
    outputSchema: {
      server: z.any(),
    },
  },
  async (params) => {
    try {
      const client = getKomodoClient();
      const updateConfig: any = {};

      if (params.address !== undefined) updateConfig.address = params.address;
      if (params.region !== undefined) updateConfig.region = params.region;
      if (params.enabled !== undefined) updateConfig.enabled = params.enabled;

      const server = await client.update_server(params.server_id, {
        config: Object.keys(updateConfig).length > 0 ? updateConfig : undefined,
        description: params.description,
        tags: params.tags,
      });

      const output = { server };
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(output, null, 2),
          },
        ],
        structuredContent: output,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Register delete_server tool
server.registerTool(
  'delete_server',
  {
    title: 'Delete Server',
    description: 'Elimina un servidor de Komodo',
    inputSchema: {
      server_id: z.string().describe('ID del servidor a eliminar'),
    },
    outputSchema: {
      success: z.boolean(),
      message: z.string(),
    },
  },
  async ({ server_id }) => {
    try {
      const client = getKomodoClient();
      await client.delete_server(server_id);

      const output = { success: true, message: `Server ${server_id} deleted successfully` };
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(output, null, 2),
          },
        ],
        structuredContent: output,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Register rename_server tool
server.registerTool(
  'rename_server',
  {
    title: 'Rename Server',
    description: 'Renombra un servidor en Komodo',
    inputSchema: {
      server_id: z.string().describe('ID del servidor a renombrar'),
      new_name: z.string().describe('Nuevo nombre para el servidor'),
    },
    outputSchema: {
      server: z.any(),
    },
  },
  async ({ server_id, new_name }) => {
    try {
      const client = getKomodoClient();
      const server = await client.rename_server(server_id, new_name);

      const output = { server };
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(output, null, 2),
          },
        ],
        structuredContent: output,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ===== DEPLOYMENT TOOLS =====

// Register list_deployments tool
server.registerTool(
  'list_deployments',
  {
    title: 'List Deployments',
    description: 'Lista todos los deployments disponibles en Komodo',
    inputSchema: {},
    outputSchema: {
      deployments: z.array(z.any()),
    },
  },
  async () => {
    try {
      const client = getKomodoClient();
      const deployments = await client.list_deployments({});

      const output = { deployments };
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(output, null, 2),
          },
        ],
        structuredContent: output,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Register get_deployment tool
server.registerTool(
  'get_deployment',
  {
    title: 'Get Deployment',
    description: 'Obtiene información detallada de un deployment específico',
    inputSchema: {
      deployment_id: z.string().describe('ID del deployment'),
    },
    outputSchema: {
      deployment: z.any(),
    },
  },
  async ({ deployment_id }) => {
    try {
      const client = getKomodoClient();
      const deployment = await client.get_deployment(deployment_id);

      const output = { deployment };
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(output, null, 2),
          },
        ],
        structuredContent: output,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Register create_deployment tool
server.registerTool(
  'create_deployment',
  {
    title: 'Create Deployment',
    description: 'Crea un nuevo deployment en Komodo',
    inputSchema: {
      name: z.string().describe('Nombre del deployment'),
      server_id: z.string().describe('ID del servidor donde se desplegará'),
      image: z.string().describe('Imagen Docker a desplegar'),
      ports: z.array(z.string()).optional().describe('Puertos a exponer (ej: ["8080:80"])'),
      volumes: z.array(z.string()).optional().describe('Volúmenes a montar'),
      environment: z.record(z.string()).optional().describe('Variables de entorno'),
      description: z.string().optional().describe('Descripción del deployment'),
      tags: z.array(z.string()).optional().describe('Tags para el deployment'),
    },
    outputSchema: {
      deployment: z.any(),
    },
  },
  async (params) => {
    try {
      const client = getKomodoClient();
      const deployment = await client.create_deployment({
        name: params.name,
        config: {
          server_id: params.server_id,
          image: params.image,
          ports: params.ports,
          volumes: params.volumes,
          environment: params.environment,
        },
        description: params.description,
        tags: params.tags,
      });

      const output = { deployment };
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(output, null, 2),
          },
        ],
        structuredContent: output,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Register deploy tool
server.registerTool(
  'deploy',
  {
    title: 'Deploy',
    description: 'Despliega un deployment (ejecuta el despliegue)',
    inputSchema: {
      deployment_id: z.string().describe('ID del deployment a desplegar'),
    },
    outputSchema: {
      update: z.any(),
    },
  },
  async ({ deployment_id }) => {
    try {
      const client = getKomodoClient();
      const update = await client.deploy(deployment_id);

      const output = { update };
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(output, null, 2),
          },
        ],
        structuredContent: output,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Register start_deployment tool
server.registerTool(
  'start_deployment',
  {
    title: 'Start Deployment',
    description: 'Inicia un deployment detenido',
    inputSchema: {
      deployment_id: z.string().describe('ID del deployment a iniciar'),
    },
    outputSchema: {
      update: z.any(),
    },
  },
  async ({ deployment_id }) => {
    try {
      const client = getKomodoClient();
      const update = await client.start_deployment(deployment_id);

      const output = { update };
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(output, null, 2),
          },
        ],
        structuredContent: output,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Register stop_deployment tool
server.registerTool(
  'stop_deployment',
  {
    title: 'Stop Deployment',
    description: 'Detiene un deployment en ejecución',
    inputSchema: {
      deployment_id: z.string().describe('ID del deployment a detener'),
    },
    outputSchema: {
      update: z.any(),
    },
  },
  async ({ deployment_id }) => {
    try {
      const client = getKomodoClient();
      const update = await client.stop_deployment(deployment_id);

      const output = { update };
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(output, null, 2),
          },
        ],
        structuredContent: output,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Register restart_deployment tool
server.registerTool(
  'restart_deployment',
  {
    title: 'Restart Deployment',
    description: 'Reinicia un deployment',
    inputSchema: {
      deployment_id: z.string().describe('ID del deployment a reiniciar'),
    },
    outputSchema: {
      update: z.any(),
    },
  },
  async ({ deployment_id }) => {
    try {
      const client = getKomodoClient();
      const update = await client.restart_deployment(deployment_id);

      const output = { update };
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(output, null, 2),
          },
        ],
        structuredContent: output,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Register delete_deployment tool
server.registerTool(
  'delete_deployment',
  {
    title: 'Delete Deployment',
    description: 'Elimina un deployment de Komodo',
    inputSchema: {
      deployment_id: z.string().describe('ID del deployment a eliminar'),
    },
    outputSchema: {
      success: z.boolean(),
      message: z.string(),
    },
  },
  async ({ deployment_id }) => {
    try {
      const client = getKomodoClient();
      await client.delete_deployment(deployment_id);

      const output = { success: true, message: `Deployment ${deployment_id} deleted successfully` };
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(output, null, 2),
          },
        ],
        structuredContent: output,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Setup Express and HTTP transport
const app = express();
app.use(express.json());

app.post('/mcp', async (req, res) => {
  // Create a new transport for each request in stateless mode
  // This prevents request ID collisions between different clients
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  res.on('close', () => {
    transport.close();
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const port = parseInt(process.env.PORT || '9715');
app.listen(port, () => {
  console.log(`Komodo MCP Server running on http://localhost:${port}/mcp`);
}).on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});
