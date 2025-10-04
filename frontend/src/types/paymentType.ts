export interface DeliveryMethod {
    type: 'standard' | 'express';
    label: string;
    description: string;
    fee: number;
    icon: string;
  }
  export interface PaymentMethod {
    type: string;
    label: string;
    description: string;
    category: 'offline' | 'online';
    accountInfo?: {
      bankId: string;
      bankAccount: string;
      phoneNumber?: string; // For MoMo (last 3 digits)
    };
    vnpayInfo?: {
      merchantId: string;
      merchantName: string;
      store: string;
      terminal: string;
    };
    logoUrl?: string;
  }
  