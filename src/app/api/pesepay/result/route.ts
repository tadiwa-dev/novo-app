import { NextResponse } from 'next/server';
import { getPesepayClient } from '@/lib/pesepay';

// Pesepay posts results here (server-to-server)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Body may be encrypted payload depending on SDK internals; pesepay SDK handles decrypt via checkPayment
    const referenceNumber = body?.referenceNumber || body?.reference || body?.ref;
    if (!referenceNumber) {
      return NextResponse.json({ ok: false }, { status: 200 });
    }
    const pesepay = getPesepayClient();
    // Some SDKs require poll URL; if posted, prefer it. Fallback to referenceNumber.
    const status = await pesepay.checkPaymentStatus(referenceNumber);
    // TODO: persist status if needed (e.g., in Firestore)
    return NextResponse.json({ ok: true, status });
  } catch (error) {
    // Always 200 so gateway does not retry indefinitely
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}


