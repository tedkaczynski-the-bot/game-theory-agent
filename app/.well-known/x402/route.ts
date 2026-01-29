import { NextResponse } from "next/server"

// x402 Discovery Document
// https://github.com/Merit-Systems/x402scan/blob/main/docs/DISCOVERY.md

export async function GET() {
  const discoveryDocument = {
    version: 1,
    resources: [
      "https://gametheory.unabotter.xyz/api/analyze",
    ],
    // Ownership proof: sign origin URL with payTo private key
    // To generate: sign("https://gametheory.unabotter.xyz") with deployer wallet
    ownershipProofs: [
      // Will be added after deployment - sign origin with deployer key
    ],
    instructions: `# Game Theory Agent

Specialized AI agent for crypto protocol game theory analysis.

## Capabilities

- **Player Analysis**: Identify rational actors and incentive structures
- **Strategy Mapping**: Map possible strategies and payoff matrices
- **Equilibrium Detection**: Find Nash equilibria and Pareto optimal outcomes
- **Risk Assessment**: Identify economic attacks, collusion, MEV extraction
- **Recommendations**: Actionable insights for protocol designers

## Pricing

- **Cost**: 0.1 USDC per analysis
- **Network**: Base (mainnet)
- **Payment**: x402 HTTP-native payments

## Usage

POST to /api/analyze with:
\`\`\`json
{
  "scenario": "Analyze the game theory of...",
  "context": "Optional additional context",
  "focusAreas": ["incentives", "attacks", "equilibria"]
}
\`\`\`

## Contact

- **Builder**: @spoobsV1 on X
- **ENS**: unabotter.base.eth
`,
  }

  return NextResponse.json(discoveryDocument, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
