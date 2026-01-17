import crypto from "crypto";

// PayFast configuration
export const PAYFAST_CONFIG = {
  // Sandbox (testing)
  sandbox: {
    processUrl: "https://sandbox.payfast.co.za/eng/process",
    validateUrl: "https://sandbox.payfast.co.za/eng/query/validate",
  },
  // Production (live)
  production: {
    processUrl: "https://www.payfast.co.za/eng/process",
    validateUrl: "https://www.payfast.co.za/eng/query/validate",
  },
};

export interface PayFastPaymentData {
  // Merchant details (required)
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;

  // Buyer details (optional but recommended)
  name_first?: string;
  name_last?: string;
  email_address?: string;
  cell_number?: string;

  // Transaction details (required)
  m_payment_id: string; // Unique payment ID from your system
  amount: string; // Amount in ZAR (e.g., "100.00")
  item_name: string;
  item_description?: string;

  // Custom fields (optional)
  custom_int1?: string;
  custom_int2?: string;
  custom_int3?: string;
  custom_int4?: string;
  custom_int5?: string;
  custom_str1?: string;
  custom_str2?: string;
  custom_str3?: string;
  custom_str4?: string;
  custom_str5?: string;

  // Payment options
  email_confirmation?: "0" | "1";
  confirmation_address?: string;
  payment_method?: string;
}

export interface PayFastITNData {
  // Merchant details
  m_payment_id: string;
  pf_payment_id: string;
  payment_status: "COMPLETE" | "FAILED" | "PENDING";
  item_name: string;
  item_description?: string;

  // Amount details
  amount_gross: string;
  amount_fee: string;
  amount_net: string;

  // Custom fields
  custom_str1?: string;
  custom_str2?: string;
  custom_str3?: string;
  custom_str4?: string;
  custom_str5?: string;
  custom_int1?: string;
  custom_int2?: string;
  custom_int3?: string;
  custom_int4?: string;
  custom_int5?: string;

  // Buyer details
  name_first?: string;
  name_last?: string;
  email_address?: string;
  merchant_id?: string;

  // Signature
  signature?: string;
}

/**
 * Generate MD5 signature for PayFast payment data
 * Parameters must be in specific order as per PayFast documentation
 */
export function generatePayFastSignature(
  data: Partial<PayFastPaymentData>,
  passphrase?: string
): string {
  // Parameter order as specified by PayFast
  const paramOrder = [
    "merchant_id",
    "merchant_key",
    "return_url",
    "cancel_url",
    "notify_url",
    "name_first",
    "name_last",
    "email_address",
    "cell_number",
    "m_payment_id",
    "amount",
    "item_name",
    "item_description",
    "custom_int1",
    "custom_int2",
    "custom_int3",
    "custom_int4",
    "custom_int5",
    "custom_str1",
    "custom_str2",
    "custom_str3",
    "custom_str4",
    "custom_str5",
    "email_confirmation",
    "confirmation_address",
    "payment_method",
  ];

  // Build parameter string in correct order
  const params: string[] = [];

  for (const key of paramOrder) {
    const value = data[key as keyof PayFastPaymentData];
    if (value !== undefined && value !== null && value !== "") {
      // URL encode the value (spaces as +, uppercase hex)
      const encodedValue = encodeURIComponent(value.toString())
        .replace(/%20/g, "+")
        .replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
      params.push(`${key}=${encodedValue}`);
    }
  }

  // Join with &
  let signatureString = params.join("&");

  // Append passphrase if provided
  if (passphrase && passphrase.trim() !== "") {
    const encodedPassphrase = encodeURIComponent(passphrase.trim())
      .replace(/%20/g, "+");
    signatureString += `&passphrase=${encodedPassphrase}`;
  }

  // Generate MD5 hash
  return crypto.createHash("md5").update(signatureString).digest("hex");
}

/**
 * Validate ITN signature from PayFast
 */
export function validateITNSignature(
  data: PayFastITNData,
  passphrase?: string
): boolean {
  const receivedSignature = data.signature;
  if (!receivedSignature) {
    return false;
  }

  // Create a copy without the signature
  const dataWithoutSignature = { ...data };
  delete dataWithoutSignature.signature;

  // Build signature string from received data (in the order received)
  const params: string[] = [];

  for (const [key, value] of Object.entries(dataWithoutSignature)) {
    if (value !== undefined && value !== null && value !== "") {
      const encodedValue = encodeURIComponent(value.toString())
        .replace(/%20/g, "+");
      params.push(`${key}=${encodedValue}`);
    }
  }

  let signatureString = params.join("&");

  // Append passphrase if provided
  if (passphrase && passphrase.trim() !== "") {
    const encodedPassphrase = encodeURIComponent(passphrase.trim())
      .replace(/%20/g, "+");
    signatureString += `&passphrase=${encodedPassphrase}`;
  }

  // Generate MD5 hash and compare
  const calculatedSignature = crypto
    .createHash("md5")
    .update(signatureString)
    .digest("hex");

  return calculatedSignature === receivedSignature;
}

/**
 * Verify payment with PayFast server
 */
export async function verifyPaymentWithPayFast(
  pfParamString: string,
  sandbox = false
): Promise<boolean> {
  const config = sandbox ? PAYFAST_CONFIG.sandbox : PAYFAST_CONFIG.production;

  try {
    const response = await fetch(config.validateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: pfParamString,
    });

    const result = await response.text();
    return result === "VALID";
  } catch (error) {
    console.error("PayFast verification error:", error);
    return false;
  }
}

/**
 * Check if the payment host is valid PayFast
 */
export function isValidPayFastHost(host: string): boolean {
  const validHosts = [
    "www.payfast.co.za",
    "sandbox.payfast.co.za",
    "w1w.payfast.co.za",
    "w2w.payfast.co.za",
  ];
  return validHosts.includes(host);
}

/**
 * Build form data for PayFast payment redirect
 */
export function buildPayFastFormData(
  paymentData: Omit<PayFastPaymentData, "merchant_id" | "merchant_key">,
  sandbox = false
): { formData: PayFastPaymentData; signature: string; actionUrl: string } {
  const merchantId = process.env.PAYFAST_MERCHANT_ID;
  const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
  const passphrase = process.env.PAYFAST_PASSPHRASE;

  if (!merchantId || !merchantKey) {
    throw new Error("PayFast merchant credentials not configured");
  }

  const fullData: PayFastPaymentData = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    ...paymentData,
  };

  const signature = generatePayFastSignature(fullData, passphrase);
  const config = sandbox ? PAYFAST_CONFIG.sandbox : PAYFAST_CONFIG.production;

  return {
    formData: fullData,
    signature,
    actionUrl: config.processUrl,
  };
}

/**
 * Parse amount to PayFast format (2 decimal places)
 */
export function formatAmountForPayFast(amountInCents: number): string {
  return (amountInCents / 100).toFixed(2);
}

/**
 * Parse PayFast amount to cents
 */
export function parsePayFastAmount(amount: string): number {
  return Math.round(parseFloat(amount) * 100);
}
