import { KomodoClient } from 'komodo_client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize client with environment variables
const komodoClient = KomodoClient(
  process.env.KOMODO_URL || '',
  {
    type: 'api-key',
    params: {
      key: process.env.KOMODO_KEY || '',
      secret: process.env.KOMODO_SECRET || '',
    },
  }
);

export function getKomodoClient() {
  if (!process.env.KOMODO_URL || !process.env.KOMODO_KEY || !process.env.KOMODO_SECRET) {
    throw new Error('Komodo credentials not configured. Please set KOMODO_URL, KOMODO_KEY, and KOMODO_SECRET environment variables.');
  }
  return komodoClient;
}
