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
  let errorMessage: string;
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'object' && error !== null) {
    // Try to extract meaningful information from error objects
    if (error.message) {
      errorMessage = error.message;
    } else if (error.error) {
      errorMessage = typeof error.error === 'string' ? error.error : JSON.stringify(error.error);
    } else if (error.data) {
      errorMessage = typeof error.data === 'string' ? error.data : JSON.stringify(error.data);
    } else {
      errorMessage = JSON.stringify(error);
    }
  } else {
    errorMessage = String(error);
  }
  
  throw new Error(`Error executing ${operation}: ${errorMessage}`);
}