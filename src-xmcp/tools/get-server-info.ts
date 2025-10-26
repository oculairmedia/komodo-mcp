import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { getKomodoClient } from "../../src/client.js";

// Define the schema for tool parameters
export const schema = {
  server_id: z.string().describe("ID del servidor"),
};

// Define tool metadata
export const metadata: ToolMetadata = {
  name: "get_server_info",
  description: "Obtiene información detallada de un servidor específico",
  annotations: {
    title: "Get Server Info",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

// Tool implementation
export default async function getServerInfo({ server_id }: InferSchema<typeof schema>) {
  try {
    const client = getKomodoClient();
    const server = await client.get_server(server_id);

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
