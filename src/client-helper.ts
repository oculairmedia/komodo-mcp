import { KomodoClient } from 'komodo_client';
import { KomodoConfig } from './types.js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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
  // Auto-initialize from environment if not already initialized
  if (!komodoClient) {
    const url = process.env.KOMODO_URL;
    const key = process.env.KOMODO_KEY;
    const secret = process.env.KOMODO_SECRET;

    if (!url || !key || !secret) {
      throw new Error('Komodo credentials not configured. Please set KOMODO_URL, KOMODO_KEY, and KOMODO_SECRET environment variables.');
    }

    komodoClient = KomodoClient(url, {
      type: 'api-key',
      params: { key, secret },
    });
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