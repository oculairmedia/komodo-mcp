import { KomodoClient } from 'komodo_client';
import { KomodoConfig } from './types.js';

let komodoClient: ReturnType<typeof KomodoClient> | null = null;

export function initializeKomodoClient(config: KomodoConfig) {
  komodoClient = KomodoClient(config.url, {
    type: 'api-key',
    params: {
      key: config.key,
      secret: config.secret,
    },
  });
  return komodoClient;
}

export function getKomodoClient() {
  if (!komodoClient) {
    throw new Error('Komodo client not initialized. Call initializeKomodoClient first.');
  }
  return komodoClient;
}

export function formatResponse(data: any, message?: string): string {
  if (message) {
    return `${message}\n\n${JSON.stringify(data, null, 2)}`;
  }
  return JSON.stringify(data, null, 2);
}

export function handleError(operation: string, error: any): never {
  const errorMessage = error instanceof Error ? error.message : String(error);
  throw new Error(`Error executing ${operation}: ${errorMessage}`);
}