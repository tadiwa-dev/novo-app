import { Pesepay } from 'pesepay';

export function getPesepayClient() {
  const integrationKey = process.env.PESEPAY_INTEGRATION_KEY as string;
  const encryptionKey = process.env.PESEPAY_ENCRYPTION_KEY as string;
  if (!integrationKey || !encryptionKey) {
    throw new Error('Pesepay keys are not configured');
  }
  const client = new Pesepay(integrationKey, encryptionKey);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  client.resultUrl = `${baseUrl}/api/pesepay/result`;
  client.returnUrl = `${baseUrl}/donate/return`;
  return client;
}

export function parseNumber(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : fallback;
}



