import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { getKomodoClient } from "./komodo-client";

// Define the schema for tool parameters
export const schema = {};

// Define tool metadata
export const metadata: ToolMetadata = {
  name: "list_servers",
  description: "Lista todos los servidores disponibles en Komodo",
  annotations: {
    title: "List Servers",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

// Tool implementation
export default async function listServers(_params: InferSchema<typeof schema>) {
  try {
    const client = getKomodoClient();
    const servers = await client.list_servers({});

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify(servers, null, 2)
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
