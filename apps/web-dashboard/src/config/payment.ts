/**
 * DealSense — UK, EU & Global Payment Gateway & Bangladesh Payout Configuration
 * 
 * ── HOW TO RECEIVE UK / EU PAYMENTS DIRECTLY INTO YOUR BANGLADESH BANK / VISA CARD ──
 * 
 * 1. OPTION A: LemonSqueezy (Recommended for Bangladesh Software Creators & SaaS)
 *    - Create a free Merchant account at https://lemonsqueezy.com (100% supports Bangladesh creators).
 *    - In LemonSqueezy Settings -> Payouts -> Connect your Bangladeshi Bank Account via Wise, Payoneer, or Direct Wire.
 *    - UK & EU buyers can pay via iDEAL, SEPA, Bacs, Apple Pay, Google Pay, and Visa/Mastercard.
 *    - Funds land automatically in your Bangladesh Bank (BRAC, DBBL, City Bank, EBL) or Visa Card.
 * 
 * 2. OPTION B: Stripe via Payoneer / Wise Global Receiving Account
 *    - Connect a USD/GBP/EUR Receiving Account from Payoneer or Wise to your Stripe account.
 *    - Payoneer & Wise auto-withdraw the earnings in BDT directly to your Bangladeshi Bank Account or Visa Card.
 * 
 * 3. OPTION C: Direct Wire / Swift to Bangladeshi Bank (For $3,500 Enterprise Orders)
 *    - Send automated invoice with your Bangladeshi Bank SWIFT/Routing code.
 */

export type SupportedCurrency = "USD" | "GBP" | "EUR";

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  flag: string;
  name: string;
  rate: number; // multiplier relative to USD base
}

export const CURRENCIES: Record<SupportedCurrency, CurrencyConfig> = {
  USD: { code: "USD", symbol: "$", flag: "🇺🇸", name: "US Dollar", rate: 1.0 },
  GBP: { code: "GBP", symbol: "£", flag: "🇬🇧", name: "British Pound", rate: 0.79 },
  EUR: { code: "EUR", symbol: "€", flag: "🇪🇺", name: "Euro", rate: 0.92 },
};

export const PAYMENT_GATEWAY_CONFIG = {
  DEFAULT_PROVIDER: "stripe_or_lemonsqueezy",

  // 1. UK & EU Supported Gateway Links (LemonSqueezy / Stripe with iDEAL, SEPA, Bacs, GPay, Apple Pay)
  STRIPE_PAYMENT_LINKS: {
    "audit-99": "https://buy.stripe.com/test_pilot_audit_99", // Replace with your real link
    "growth-499": "https://buy.stripe.com/test_agency_growth_499",
    "scale-999": "https://buy.stripe.com/test_agency_scale_999",
    "enterprise-2499": "https://buy.stripe.com/test_enterprise_fleet_2499",
    "deploy-1500": "https://buy.stripe.com/test_single_portal_1500", // Replace with your real link
    "agency-3500": "https://buy.stripe.com/test_agency_fleet_3500", // Replace with your real link
    "custom-app": "https://buy.stripe.com/test_custom_app_1500", // Replace with your real link
  },

  LEMON_SQUEEZY_LINKS: {
    "audit-99": "https://dealsense.lemonsqueezy.com/checkout/buy/7491e844-9603-480b-9c4c-03264e4dbfb9",
    "growth-499": "https://dealsense.lemonsqueezy.com/checkout/buy/7491e844-9603-480b-9c4c-03264e4dbfb9",
    "scale-999": "https://dealsense.lemonsqueezy.com/checkout/buy/7b883450-f248-4b29-bc29-d30ed6d4b5a0",
    "enterprise-2499": "https://dealsense.lemonsqueezy.com/checkout/buy/6b28e506-5fc0-4f1c-a00c-ff0689155f01",
    "deploy-1500": "https://dealsense.lemonsqueezy.com/checkout/buy/7b883450-f248-4b29-bc29-d30ed6d4b5a0",
    "agency-3500": "https://dealsense.lemonsqueezy.com/checkout/buy/6b28e506-5fc0-4f1c-a00c-ff0689155f01",
    "custom-app": "https://dealsense.lemonsqueezy.com/checkout/buy/7b883450-f248-4b29-bc29-d30ed6d4b5a0",
  },

  // 2. Direct Cross-Border Payout Channels (Direct to Bangladesh Bank)
  BANGLADESH_PAYOUT_DETAILS: {
    BENEFICIARY_NAME: "Peash Das Rudra",
    EMAIL: "peashdasrudra@gmail.com",
    SUPPORTED_LOCAL_BANKS: "BRAC Bank, Dutch-Bangla Bank (DBBL), City Bank, Eastern Bank (EBL), Islami Bank, and all Dual-Currency Visa Cards",
    TRANSFER_METHODS: "Wise Direct BDT Transfer, Payoneer Global Bank Withdrawal, Direct SWIFT Wire",
    ESTIMATED_SETTLEMENT_TIME: "24–48 Hours directly to Bangladesh Bank Account in BDT or USD",
  },
};
