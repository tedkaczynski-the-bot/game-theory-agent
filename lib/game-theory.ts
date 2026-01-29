// Game Theory Analysis Engine
// Analyzes crypto protocols, tokenomics, and mechanism design

import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface GameTheoryInput {
  scenario: string
  context?: string
  focusAreas?: string[]
}

export interface GameTheoryOutput {
  summary: string
  players: Player[]
  strategies: Strategy[]
  equilibria: Equilibrium[]
  risks: Risk[]
  recommendations: string[]
  verdict: "stable" | "unstable" | "exploitable" | "needs_analysis"
}

export interface Player {
  name: string
  type: "protocol" | "user" | "validator" | "attacker" | "governance" | "liquidity_provider"
  incentives: string[]
  resources: string[]
}

export interface Strategy {
  player: string
  action: string
  payoff: string
  dominant: boolean
}

export interface Equilibrium {
  type: "nash" | "pareto" | "subgame_perfect" | "bayesian"
  description: string
  stability: "stable" | "unstable" | "conditionally_stable"
}

export interface Risk {
  category: "economic_attack" | "governance_attack" | "collusion" | "information_asymmetry" | "mechanism_failure"
  severity: "critical" | "high" | "medium" | "low"
  description: string
  mitigation?: string
}

const SYSTEM_PROMPT = `You are an expert game theorist specializing in crypto protocols, DeFi mechanisms, tokenomics, and mechanism design. You analyze scenarios through the lens of:

1. **Player Analysis**: Identify all rational actors and their incentive structures
2. **Strategy Space**: Map out possible strategies for each player
3. **Equilibrium Analysis**: Find Nash equilibria, Pareto optimal outcomes
4. **Attack Vectors**: Identify economic attacks, collusion risks, MEV extraction
5. **Mechanism Design**: Evaluate incentive compatibility and strategy-proofness

When analyzing, consider:
- Rational self-interest of all participants
- Information asymmetries
- Coordination problems
- Time preferences and discount rates
- Network effects and externalities
- Sybil attacks and identity gaming
- Oracle manipulation and price feeds
- Governance capture and plutocracy risks

Provide actionable insights for protocol designers and users.

IMPORTANT: Return your analysis as valid JSON matching this schema:
{
  "summary": "Brief overview of the game-theoretic situation",
  "players": [{ "name": string, "type": string, "incentives": string[], "resources": string[] }],
  "strategies": [{ "player": string, "action": string, "payoff": string, "dominant": boolean }],
  "equilibria": [{ "type": string, "description": string, "stability": string }],
  "risks": [{ "category": string, "severity": string, "description": string, "mitigation": string }],
  "recommendations": string[],
  "verdict": "stable" | "unstable" | "exploitable" | "needs_analysis"
}`

export async function analyzeGameTheory(input: GameTheoryInput): Promise<GameTheoryOutput> {
  const userMessage = `
Analyze the following crypto/DeFi scenario from a game-theoretic perspective:

**Scenario:**
${input.scenario}

${input.context ? `**Additional Context:**\n${input.context}` : ""}

${input.focusAreas?.length ? `**Focus Areas:** ${input.focusAreas.join(", ")}` : ""}

Provide a comprehensive game-theoretic analysis with players, strategies, equilibria, risks, and recommendations.
Return as JSON.`

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    temperature: 0.7,
    max_tokens: 4000,
    response_format: { type: "json_object" },
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error("No response from analysis model")
  }

  try {
    const result = JSON.parse(content) as GameTheoryOutput
    return result
  } catch {
    // If JSON parsing fails, return a structured error response
    return {
      summary: content,
      players: [],
      strategies: [],
      equilibria: [],
      risks: [],
      recommendations: ["Analysis completed but structured output unavailable"],
      verdict: "needs_analysis",
    }
  }
}

// Input/output examples for x402 bazaar schema
export const EXAMPLE_INPUT: GameTheoryInput = {
  scenario: "Analyze the game theory of Uniswap V3 concentrated liquidity positions",
  context: "LPs can concentrate liquidity in specific price ranges for higher fees but risk impermanent loss",
  focusAreas: ["LP incentives", "MEV extraction", "Price oracle manipulation"],
}

export const EXAMPLE_OUTPUT: GameTheoryOutput = {
  summary: "Uniswap V3 concentrated liquidity creates a complex game between LPs, traders, and MEV extractors with multiple equilibria.",
  players: [
    {
      name: "Liquidity Provider",
      type: "liquidity_provider",
      incentives: ["Maximize fee revenue", "Minimize impermanent loss"],
      resources: ["Capital", "Price prediction ability"],
    },
    {
      name: "Arbitrageur",
      type: "user",
      incentives: ["Extract price discrepancies", "Front-run large trades"],
      resources: ["Speed", "Capital", "Information"],
    },
  ],
  strategies: [
    {
      player: "Liquidity Provider",
      action: "Concentrate liquidity in narrow range",
      payoff: "Higher fees but higher IL risk",
      dominant: false,
    },
  ],
  equilibria: [
    {
      type: "nash",
      description: "LPs cluster around current price, creating deep liquidity at market price",
      stability: "conditionally_stable",
    },
  ],
  risks: [
    {
      category: "economic_attack",
      severity: "medium",
      description: "JIT liquidity can extract value from passive LPs",
      mitigation: "Use time-weighted position strategies",
    },
  ],
  recommendations: [
    "Consider JIT-resistant position management",
    "Monitor price volatility for range adjustments",
  ],
  verdict: "stable",
}

export const INPUT_SCHEMA = {
  type: "object",
  properties: {
    scenario: {
      type: "string",
      description: "The crypto/DeFi scenario to analyze",
    },
    context: {
      type: "string",
      description: "Additional context or constraints",
    },
    focusAreas: {
      type: "array",
      items: { type: "string" },
      description: "Specific areas to focus the analysis on",
    },
  },
  required: ["scenario"],
}
