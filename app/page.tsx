"use client"

import { useState } from "react"

const EXAMPLE_SCENARIOS = [
  {
    name: "Uniswap V3 LP Strategy",
    scenario: "Analyze the game theory of concentrated liquidity provision in Uniswap V3",
    context: "LPs can concentrate liquidity in specific price ranges. Consider JIT liquidity, MEV, and impermanent loss.",
    focusAreas: ["LP incentives", "MEV extraction", "Optimal range selection"],
  },
  {
    name: "Liquid Staking Dominance",
    scenario: "Analyze the game theory of Lido's dominance in Ethereum liquid staking",
    context: "Lido controls ~30% of staked ETH. Consider validator centralization, governance, and network effects.",
    focusAreas: ["Centralization risks", "Governance capture", "Network effects"],
  },
  {
    name: "Curve Wars",
    scenario: "Analyze the game theory of vote-escrowed tokenomics (veCRV model)",
    context: "Protocols compete for CRV emissions by accumulating veCRV. Consider bribes, Convex, and long-term alignment.",
    focusAreas: ["Bribery dynamics", "Lock-up incentives", "Protocol competition"],
  },
]

interface AnalysisResult {
  output?: {
    summary: string
    players: Array<{ name: string; type: string; incentives: string[]; resources: string[] }>
    strategies: Array<{ player: string; action: string; payoff: string; dominant: boolean }>
    equilibria: Array<{ type: string; description: string; stability: string }>
    risks: Array<{ category: string; severity: string; description: string; mitigation?: string }>
    recommendations: string[]
    verdict: string
  }
  error?: string
}

export default function Home() {
  const [scenario, setScenario] = useState("")
  const [context, setContext] = useState("")
  const [focusAreas, setFocusAreas] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const runAnalysis = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario,
          context: context || undefined,
          focusAreas: focusAreas ? focusAreas.split(",").map((s) => s.trim()) : undefined,
        }),
      })

      const data = await response.json()
      
      if (response.status === 402) {
        setResult({ error: "Payment required. This is a paid API - 0.1 USDC per analysis." })
      } else if (!response.ok) {
        setResult({ error: data.error || "Analysis failed" })
      } else {
        setResult(data)
      }
    } catch (err) {
      setResult({ error: "Network error. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const loadExample = (example: typeof EXAMPLE_SCENARIOS[0]) => {
    setScenario(example.scenario)
    setContext(example.context)
    setFocusAreas(example.focusAreas.join(", "))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-400 bg-red-950"
      case "high": return "text-orange-400 bg-orange-950"
      case "medium": return "text-yellow-400 bg-yellow-950"
      case "low": return "text-green-400 bg-green-950"
      default: return "text-zinc-400 bg-zinc-800"
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "stable": return "text-green-400"
      case "unstable": return "text-yellow-400"
      case "exploitable": return "text-red-400"
      default: return "text-zinc-400"
    }
  }

  return (
    <main className="min-h-dvh">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="font-semibold text-lg">Game Theory Agent</h1>
              <p className="text-xs text-zinc-500">by unabotter.base.eth</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://x402scan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              x402scan →
            </a>
            <div className="flex items-center gap-2 text-sm">
              <span className="size-2 rounded-full bg-green-500 animate-pulse-slow" />
              <span className="text-zinc-400">0.1 USDC/query</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-balance">
            Game Theory Analysis for Crypto Protocols
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-pretty">
            Analyze player incentives, Nash equilibria, attack vectors, and mechanism design. 
            Get actionable insights for DeFi protocols, tokenomics, and governance systems.
          </p>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <section>
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <svg className="size-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Analysis Input
              </h3>

              {/* Quick Examples */}
              <div className="mb-4">
                <p className="text-sm text-zinc-500 mb-2">Quick examples:</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_SCENARIOS.map((ex) => (
                    <button
                      key={ex.name}
                      onClick={() => loadExample(ex)}
                      className="text-xs px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                    >
                      {ex.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Scenario <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                    placeholder="Describe the crypto protocol, mechanism, or situation you want to analyze..."
                    className="w-full h-32 px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Additional Context
                  </label>
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Any additional context, constraints, or parameters..."
                    className="w-full h-20 px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Focus Areas
                  </label>
                  <input
                    type="text"
                    value={focusAreas}
                    onChange={(e) => setFocusAreas(e.target.value)}
                    placeholder="e.g., incentives, attacks, equilibria (comma-separated)"
                    className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={runAnalysis}
                  disabled={!scenario.trim() || loading}
                  className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="size-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Run Analysis
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* API Info */}
            <div className="mt-6 bg-zinc-900 rounded-xl border border-zinc-800 p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <svg className="size-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                API Access
              </h3>
              <p className="text-sm text-zinc-400 mb-3">
                Use this agent programmatically via x402 HTTP-native payments.
              </p>
              <pre className="text-xs overflow-x-auto">
{`curl -X POST https://gametheory.unabotter.xyz/api/analyze \\
  -H "Content-Type: application/json" \\
  -H "X-Payment-Signature: <your_payment>" \\
  -d '{"scenario": "Analyze..."}'`}
              </pre>
            </div>
          </section>

          {/* Results Section */}
          <section>
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 min-h-[600px]">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <svg className="size-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Analysis Results
              </h3>

              {!result && !loading && (
                <div className="flex flex-col items-center justify-center h-[500px] text-center">
                  <div className="size-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                    <svg className="size-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <p className="text-zinc-500">Enter a scenario and run analysis to see results</p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center h-[500px]">
                  <div className="size-12 border-4 border-zinc-700 border-t-blue-500 rounded-full animate-spin mb-4" />
                  <p className="text-zinc-400">Analyzing game theory dynamics...</p>
                  <p className="text-sm text-zinc-600 mt-2">This may take 10-30 seconds</p>
                </div>
              )}

              {result?.error && (
                <div className="bg-red-950 border border-red-800 rounded-lg p-4">
                  <p className="text-red-400 font-medium">{result.error}</p>
                </div>
              )}

              {result?.output && (
                <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-300px)]">
                  {/* Verdict */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-zinc-500">Verdict:</span>
                    <span className={`font-semibold uppercase ${getVerdictColor(result.output.verdict)}`}>
                      {result.output.verdict.replace("_", " ")}
                    </span>
                  </div>

                  {/* Summary */}
                  <div>
                    <h4 className="text-sm font-medium text-zinc-400 mb-2">Summary</h4>
                    <p className="text-zinc-200 text-pretty">{result.output.summary}</p>
                  </div>

                  {/* Players */}
                  {result.output.players?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-zinc-400 mb-2">Players</h4>
                      <div className="space-y-2">
                        {result.output.players.map((player, i) => (
                          <div key={i} className="bg-zinc-800 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{player.name}</span>
                              <span className="text-xs px-2 py-0.5 rounded bg-zinc-700 text-zinc-400">
                                {player.type}
                              </span>
                            </div>
                            <p className="text-sm text-zinc-400">
                              <span className="text-zinc-500">Incentives:</span> {player.incentives?.join(", ")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Risks */}
                  {result.output.risks?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-zinc-400 mb-2">Risks</h4>
                      <div className="space-y-2">
                        {result.output.risks.map((risk, i) => (
                          <div key={i} className="bg-zinc-800 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs px-2 py-0.5 rounded ${getSeverityColor(risk.severity)}`}>
                                {risk.severity}
                              </span>
                              <span className="text-sm text-zinc-400">{risk.category.replace(/_/g, " ")}</span>
                            </div>
                            <p className="text-sm text-zinc-200">{risk.description}</p>
                            {risk.mitigation && (
                              <p className="text-sm text-green-400 mt-1">
                                → {risk.mitigation}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Equilibria */}
                  {result.output.equilibria?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-zinc-400 mb-2">Equilibria</h4>
                      <div className="space-y-2">
                        {result.output.equilibria.map((eq, i) => (
                          <div key={i} className="bg-zinc-800 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium capitalize">{eq.type.replace(/_/g, " ")}</span>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                eq.stability === "stable" ? "bg-green-950 text-green-400" :
                                eq.stability === "unstable" ? "bg-red-950 text-red-400" :
                                "bg-yellow-950 text-yellow-400"
                              }`}>
                                {eq.stability}
                              </span>
                            </div>
                            <p className="text-sm text-zinc-300">{eq.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {result.output.recommendations?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-zinc-400 mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {result.output.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-zinc-200">
                            <span className="text-blue-400 mt-1">→</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between text-sm text-zinc-500">
          <p>Built by <a href="https://x.com/spoobsV1" className="text-zinc-400 hover:text-white">@spoobsV1</a></p>
          <div className="flex items-center gap-4">
            <a href="/.well-known/x402" className="hover:text-white">Discovery Doc</a>
            <a href="/api/analyze" className="hover:text-white">API Schema</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
