import { z } from 'zod';

/**
 * Consolidated tool definition with operation discriminator
 */
export interface ConsolidatedToolDefinition {
  name: string;
  title: string;
  description: string;
  operations: string[];
  inputSchema: Record<string, z.ZodTypeAny>;
  handler: (params: any) => Promise<{
    content: Array<{ type: 'text'; text: string }>;
    structuredContent?: any;
    isError?: boolean;
  }>;
}

/**
 * Create a standardized success response
 */
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

/**
 * Handle errors consistently across all tools
 */
export function handleToolError(error: unknown) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return createToolResponse(null, errorMessage);
}
