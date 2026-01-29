import { NextRequest, NextResponse } from "next/server"
import {
  createX402Response,
  create402Response,
  hasValidPayment,
} from "@/lib/x402"
import {
  analyzeGameTheory,
  GameTheoryInput,
  EXAMPLE_INPUT,
  EXAMPLE_OUTPUT,
  INPUT_SCHEMA,
} from "@/lib/game-theory"

const ENDPOINT_URL = "https://gametheory.unabotter.xyz/api/analyze"
const DESCRIPTION = "Game theory analysis for crypto protocols, tokenomics, and mechanism design. Analyzes player incentives, Nash equilibria, attack vectors, and provides actionable recommendations."

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Payment-Signature",
    },
  })
}

// GET returns 402 with x402 V2 schema (for discovery and pricing)
export async function GET() {
  const x402Body = createX402Response(
    ENDPOINT_URL,
    DESCRIPTION,
    EXAMPLE_INPUT,
    EXAMPLE_OUTPUT,
    INPUT_SCHEMA
  )
  return create402Response(x402Body)
}

// POST processes the analysis (requires payment in production)
export async function POST(request: NextRequest) {
  // Add CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Payment-Signature",
  }

  try {
    // Check for payment (in production, verify with x402 facilitator)
    // For demo/testing, we'll allow requests through
    const hasPaid = hasValidPayment(request)
    const isDemoMode = process.env.DEMO_MODE === "true"

    if (!hasPaid && !isDemoMode) {
      // Return 402 with payment details
      const x402Body = createX402Response(
        ENDPOINT_URL,
        DESCRIPTION,
        EXAMPLE_INPUT,
        EXAMPLE_OUTPUT,
        INPUT_SCHEMA
      )
      return create402Response(x402Body)
    }

    // Parse input
    const body = await request.json()
    const input: GameTheoryInput = body.input || body

    if (!input.scenario) {
      return NextResponse.json(
        { error: "Missing required field: scenario" },
        { status: 400, headers: corsHeaders }
      )
    }

    // Run analysis
    const result = await analyzeGameTheory(input)

    return NextResponse.json(
      { output: result, usage: { total_tokens: 0 } },
      { status: 200, headers: corsHeaders }
    )
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      { error: "Analysis failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500, headers: corsHeaders }
    )
  }
}
