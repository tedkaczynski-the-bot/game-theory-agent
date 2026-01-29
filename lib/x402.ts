// x402 V2 Schema Implementation
// https://www.x402scan.com/resources/register

export const PAYMENT_CONFIG = {
  network: "eip155:8453", // Base mainnet CAIP-2 format
  asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
  payTo: "0x81FD234f63Dd559d0EDA56d17BB1Bb78f236DB37", // unabotter.base.eth
  maxTimeoutSeconds: 300,
  amount: "100000", // 0.1 USDC (6 decimals)
}

export interface X402V2Response {
  x402Version: 2
  error?: string
  accepts?: X402Accepts[]
  resource?: X402Resource
  extensions?: X402Extensions
}

export interface X402Accepts {
  scheme: "exact"
  network: string
  amount: string
  payTo: string
  maxTimeoutSeconds: number
  asset: string
  extra: Record<string, unknown>
}

export interface X402Resource {
  url: string
  description: string
  mimeType: string
}

export interface X402Extensions {
  bazaar?: {
    info?: {
      input: unknown
      output?: unknown
    }
    schema?: unknown
  }
}

export function createX402Response(
  endpoint: string,
  description: string,
  inputExample: unknown,
  outputExample: unknown,
  inputSchema: unknown
): X402V2Response {
  return {
    x402Version: 2,
    accepts: [
      {
        scheme: "exact",
        network: PAYMENT_CONFIG.network,
        amount: PAYMENT_CONFIG.amount,
        payTo: PAYMENT_CONFIG.payTo,
        maxTimeoutSeconds: PAYMENT_CONFIG.maxTimeoutSeconds,
        asset: PAYMENT_CONFIG.asset,
        extra: {
          description: "USDC on Base",
        },
      },
    ],
    resource: {
      url: endpoint,
      description,
      mimeType: "application/json",
    },
    extensions: {
      bazaar: {
        info: {
          input: inputExample,
          output: outputExample,
        },
        schema: inputSchema,
      },
    },
  }
}

export function create402Response(x402Body: X402V2Response): Response {
  return new Response(JSON.stringify(x402Body), {
    status: 402,
    headers: {
      "Content-Type": "application/json",
      "X-Payment-Required": "true",
      "X-Payment-Network": PAYMENT_CONFIG.network,
      "X-Payment-Amount": PAYMENT_CONFIG.amount,
      "X-Payment-Asset": PAYMENT_CONFIG.asset,
      "X-Payment-PayTo": PAYMENT_CONFIG.payTo,
    },
  })
}

// Verify payment header (simplified - in production use x402 facilitator)
export function hasValidPayment(request: Request): boolean {
  const paymentHeader = request.headers.get("X-Payment-Signature")
  // In production, verify with x402 facilitator
  // For now, check if header exists
  return !!paymentHeader
}
