declare module 'pesepay' {
  export class Pesepay {
    constructor(integrationKey: string, encryptionKey: string);
    resultUrl: string;
    returnUrl: string;
    createTransaction(amount: number, currencyCode: string, reason: string): any;
    initiateTransaction(transaction: any): Promise<{ redirectUrl: string; referenceNumber: string }>;
    checkPaymentStatus(referenceOrPollUrl: string): Promise<any>;
    createPayment(currencyCode: string, methodCode: string, email?: string, phone?: string, name?: string): any;
    makeSeamlessPayment(payment: any, reason: string, amount: number, requiredFields: Record<string, any>): Promise<{ pollUrl: string; referenceNumber: string }>;
  }
}


