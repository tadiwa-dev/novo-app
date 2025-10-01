import { NextResponse } from 'next/server';
import { getPesepayClient, parseNumber } from '@/lib/pesepay';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const amount = parseNumber(body.amount);
    const currency = 'USD' as const; // Force USD only for now
    const reason = (body.reason || 'Donation') as string;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const pesepay = getPesepayClient();
    const transaction = pesepay.createTransaction(amount, currency, reason);
    const response = await pesepay.initiateTransaction(transaction);

    return NextResponse.json({ redirectUrl: response.redirectUrl, referenceNumber: response.referenceNumber });
  } catch (error: any) {
    console.error('Pesepay initiate error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to initiate payment' }, { status: 500 });
  }
}


