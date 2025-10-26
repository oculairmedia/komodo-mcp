import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { getKomodoClient } from "./komodo-client";

// Define the schema for tool parameters
export const schema = {
  name: z.string().describe("Nombre del servidor"),
  address: z.string().describe("Dirección del servidor (ej: http://localhost:8120)"),
  region: z.string().optional().describe("Región del servidor"),
  enabled: z.boolean().optional().default(true).describe("Si el servidor está habilitado"),
  description: z.string().optional().describe("Descripción del servidor"),
  tags: z.array(z.string()).optional().describe("Tags para el servidor"),
};

// Define tool metadata
export const metadata: ToolMetadata = {
  name: "create_server",
  description: "Crea un nuevo servidor en Komodo",
  annotations: {
    title: "Create Server",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
  },
};

// Tool implementation
export default async function createServer(params: InferSchema<typeof schema>) {
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

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify(server, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text" as const,
        text: `Error: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}
