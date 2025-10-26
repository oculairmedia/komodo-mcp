import { z } from 'zod';

export interface ToolDefinition {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, z.ZodTypeAny>;
  outputSchema?: Record<string, z.ZodTypeAny>;
  handler: (params: any) => Promise<{
    content: Array<{ type: 'text'; text: string }>;
    structuredContent?: any;
    isError?: boolean;
  }>;
}

export function createToolResponse(data: any, error?: string) {
  if (error) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${error}` }],
      isError: true,
    };
  }

  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
    structuredContent: data,
  };
}

export function handleToolError(error: unknown) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return createToolResponse(null, errorMessage);
}
