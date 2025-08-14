// Type definitions for Komodo API resources

export interface KomodoConfig {
  url: string;
  key: string;
  secret: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface ToolHandler {
  (args: any): Promise<{
    content: [{
      type: 'text';
      text: string;
    }];
  }>;
}

export interface ResourceModule {
  getTools(): ToolDefinition[];
  getHandlers(): Record<string, ToolHandler>;
}