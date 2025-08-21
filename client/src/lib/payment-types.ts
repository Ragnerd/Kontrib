// Payment type definitions for Nigerian and diaspora users

export interface PaymentTypeOption {
  value: string;
  label: string;
  description: string;
  icon: string;
  countries: string[]; // Which countries this payment method is popular in
  requiresAccount?: boolean; // Whether this payment method needs account details
}

export const PAYMENT_TYPES: PaymentTypeOption[] = [
  // Nigerian payment methods
  {
    value: "bank_transfer",
    label: "Bank Transfer",
    description: "Transfer to Nigerian bank account",
    icon: "🏦",
    countries: ["NG"],
    requiresAccount: true,
  },
  {
    value: "mobile_money",
    label: "Mobile Money",
    description: "PalmPay, Opay, Moniepoint transfers",
    icon: "📱",
    countries: ["NG"],
    requiresAccount: true,
  },
  // US-based payment methods for diaspora
  {
    value: "zelle",
    label: "Zelle",
    description: "Quick transfers with phone or email",
    icon: "⚡",
    countries: ["US"],
    requiresAccount: true,
  },
  {
    value: "cashapp",
    label: "Cash App",
    description: "Send money using $cashtag",
    icon: "💰",
    countries: ["US"],
    requiresAccount: true,
  },
  {
    value: "venmo",
    label: "Venmo",
    description: "Social payments with @username",
    icon: "💙",
    countries: ["US"],
    requiresAccount: true,
  },
  {
    value: "paypal",
    label: "PayPal",
    description: "Send money via email address",
    icon: "🌐",
    countries: ["US", "GLOBAL"],
    requiresAccount: true,
  },
  // International options
  {
    value: "wire_transfer",
    label: "Wire Transfer",
    description: "International bank wire transfer",
    icon: "🌍",
    countries: ["GLOBAL"],
    requiresAccount: true,
  },
  {
    value: "crypto",
    label: "Cryptocurrency",
    description: "Bitcoin, USDT, or other digital currencies",
    icon: "₿",
    countries: ["GLOBAL"],
    requiresAccount: true,
  },
  // Cash options
  {
    value: "cash",
    label: "Cash",
    description: "Physical cash payment",
    icon: "💵",
    countries: ["NG", "US", "GLOBAL"],
    requiresAccount: false,
  }
];

export const getPaymentTypeLabel = (value: string): string => {
  const paymentType = PAYMENT_TYPES.find(type => type.value === value);
  return paymentType ? `${paymentType.icon} ${paymentType.label}` : value;
};

export const getPaymentTypesByCountry = (country: string): PaymentTypeOption[] => {
  return PAYMENT_TYPES.filter(type => 
    type.countries.includes(country) || type.countries.includes("GLOBAL")
  );
};

// Default payment types for different user contexts
export const getDefaultPaymentTypes = (): string[] => {
  // Return most common payment types for Nigerian and diaspora users
  return ["bank_transfer", "mobile_money", "zelle", "cashapp", "paypal"];
};