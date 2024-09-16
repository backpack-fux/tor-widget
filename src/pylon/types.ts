export type ISO3166Alpha2Country = "GB" | "US" | "FR" | "DE";
export type PaymentProcessor = "WORLDPAY";
export type Address = {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: ISO3166Alpha2Country;
};

export type ISO4217Currency = "USD";
export type GetOrderLinkOutput = {
  merchant: {
    name: string;
    fee: string;
  };
  order: {
    subtotal: number;
    currency: ISO4217Currency;
  };
  customer: {
    email: string;
    phone: string;
  };
  expiresAt: string;
  paymentToken: string;
};

export type TransactionProcessInputPreProcessed = {
  paymentProcessor: PaymentProcessor;
  order: {
    card: {
      name: string;
      number: string;
      expiryYear: number;
      expiryMonth: number;
      cvv: string;
    };
    customer: {
      email: string;
      phoneNumber: string;
      billingAddress: Address;
      shippingAddress?: Address;
    };
    value: {
      currency: ISO4217Currency;
      total: number;
      tipAmount?: number;
    };
  };
};
export type TransactionProcessInputProcessed = {
  sessionUrl: string;
  cvcUrl?: string;
  order: {
    customer: {
      email: string;
      phoneNumber: string;
      billingAddress: Address;
      shippingAddress?: Address;
    };
    value: {
      currency: ISO4217Currency;
      total: number;
      tipAmount?: number;
    };
  };
};
