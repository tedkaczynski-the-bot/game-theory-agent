"use client"

import { useState } from "react"

interface Field {
  name: string
  label: string
  type: "text" | "textarea" | "select"
  required: boolean
  placeholder?: string
  options?: string[]
  default?: string
}

interface Entrypoint {
  key: string
  name: string
  description: string
  price: string
  icon: string
  fields: Field[]
}

// Entrypoint definitions matching the Lucid agent
const ENTRYPOINTS: Entrypoint[] = [
  {
    key: "analyze",
    name: "Protocol Analysis",
    description: "Full game theory analysis of a protocol. Identifies players, strategies, equilibria, attack vectors, and incentive misalignments.",
    price: "$1.00",
    icon: "🎯",
    fields: [
      { name: "protocol", label: "Protocol", type: "text", required: true, placeholder: "e.g., Uniswap V3, Aave, Compound" },
      { name: "context", label: "Additional Context", type: "textarea", required: false, placeholder: "Docs, whitepaper links, specific concerns..." },
      { name: "depth", label: "Analysis Depth", type: "select", required: true, options: ["quick", "thorough", "exhaustive"], default: "thorough" },
    ],
  },
  {
    key: "tokenomics",
    name: "Tokenomics Audit",
    description: "Deep tokenomics audit: supply dynamics, distribution fairness, value accrual, death spiral risk, and long-term sustainability.",
    price: "$1.50",
    icon: "🪙",
    fields: [
      { name: "token", label: "Token Name/Symbol", type: "text", required: true, placeholder: "e.g., UNI, AAVE, CRV" },
      { name: "context", label: "Tokenomics Details", type: "textarea", required: false, placeholder: "Supply info, distribution, mechanisms..." },
    ],
  },
  {
    key: "governance",
    name: "Governance Attack Analysis",
    description: "Governance attack analysis: plutocratic capture, flash loan attacks, bribing vectors, voter apathy exploitation, and delegation risks.",
    price: "$0.75",
    icon: "🗳️",
    fields: [
      { name: "protocol", label: "Protocol", type: "text", required: true, placeholder: "e.g., Compound, MakerDAO" },
      { name: "governanceType", label: "Governance Type", type: "select", required: false, options: ["token-voting", "multisig", "optimistic", "conviction", "quadratic", "futarchy", "other"] },
      { name: "context", label: "Additional Context", type: "textarea", required: false, placeholder: "Quorum, voting period, timelock details..." },
    ],
  },
  {
    key: "mev",
    name: "MEV Exposure Analysis",
    description: "MEV exposure analysis: frontrunning risk, sandwich attacks, backrunning opportunities, and transaction ordering games.",
    price: "$0.50",
    icon: "⚡",
    fields: [
      { name: "target", label: "Target", type: "text", required: true, placeholder: "Protocol name, contract address, or tx type" },
      { name: "transactionType", label: "Transaction Type", type: "select", required: false, options: ["swap", "liquidation", "nft-mint", "arbitrage", "governance-vote", "staking", "bridge", "other"] },
      { name: "context", label: "Additional Context", type: "textarea", required: false, placeholder: "Contract code, specific concerns..." },
    ],
  },
  {
    key: "design",
    name: "Mechanism Design",
    description: "Mechanism design consultation: design incentive-compatible systems with desired equilibria. Includes implementation recommendations.",
    price: "$2.00",
    icon: "🔧",
    fields: [
      { name: "objective", label: "Objective", type: "text", required: true, placeholder: "What outcome are you trying to achieve?" },
      { name: "constraints", label: "Constraints", type: "textarea", required: false, placeholder: "Limitations, requirements, budget..." },
      { name: "context", label: "Additional Context", type: "textarea", required: false, placeholder: "Existing design, player types..." },
    ],
  },
]

const API_BASE = "" // Same origin - will be proxied in production

export default function Home() {
  const [activeTab, setActiveTab] = useState("analyze")
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ output?: Record<string, unknown>; error?: string } | null>(null)

  const activeEntrypoint = ENTRYPOINTS.find((e) => e.key === activeTab)!

  const handleSubmit = async () => {
    setLoading(true)
    setResult(null)

    try {
      // Build input from form data
      const input: Record<string, unknown> = {}
      for (const field of activeEntrypoint.fields) {
        if (formData[field.name]) {
          input[field.name] = formData[field.name]
        } else if (field.default) {
          input[field.name] = field.default
        }
      }

      const response = await fetch(`/entrypoints/${activeTab}/invoke`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      })

      const data = await response.json()

      if (response.status === 402) {
        setResult({
          error: `Payment Required: ${activeEntrypoint.price} USDC on Base. Use x402 payment headers to proceed.`,
        })
      } else if (!response.ok) {
        setResult({ error: data.error || "Request failed" })
      } else {
        setResult(data)
      }
    } catch (err) {
      setResult({ error: "Network error. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleFieldChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <main className="min-h-dvh bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800/50 backdrop-blur-sm sticky top-0 z-50 bg-zinc-950/80">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-lg">
              🎲
            </div>
            <div>
              <h1 className="font-semibold text-white">Game Theory Agent</h1>
              <p className="text-xs text-zinc-500">by unabotter.base.eth</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a
              href="/.well-known/agent-card.json"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Agent Card
            </a>
            <a
              href="https://x402scan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              x402scan →
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-zinc-800/50 bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white text-balance">
            Game Theory Analysis for Crypto
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-pretty mb-6">
            Find the exploits before they find you. Analyze protocol incentives, 
            Nash equilibria, attack vectors, and mechanism design.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-400">Payments via x402 on Base</span>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-zinc-900 rounded-xl mb-6 overflow-x-auto">
          {ENTRYPOINTS.map((ep) => (
            <button
              key={ep.key}
              onClick={() => {
                setActiveTab(ep.key)
                setResult(null)
                setFormData({})
              }}
              className={`flex-1 min-w-fit px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === ep.key
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <span className="mr-2">{ep.icon}</span>
              <span className="hidden sm:inline">{ep.name}</span>
              <span className="sm:hidden">{ep.key}</span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span className="text-xl">{activeEntrypoint.icon}</span>
                {activeEntrypoint.name}
              </h3>
              <span className="text-emerald-400 font-mono text-sm">{activeEntrypoint.price}</span>
            </div>
            <p className="text-sm text-zinc-400 mb-6">{activeEntrypoint.description}</p>

            <div className="space-y-4">
              {activeEntrypoint.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    {field.label}
                    {field.required && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={formData[field.name] || ""}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full h-24 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    />
                  ) : field.type === "select" ? (
                    <select
                      value={formData[field.name] || field.default || ""}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="">Select...</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData[field.name] || ""}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  )}
                </div>
              ))}

              <button
                onClick={handleSubmit}
                disabled={loading || !activeEntrypoint.fields.filter((f) => f.required).every((f) => formData[f.name])}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center justify-center gap-2"
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
                    Run Analysis
                    <span className="text-emerald-200">({activeEntrypoint.price})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <h3 className="font-semibold text-white mb-4">Results</h3>

            {!result && !loading && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="size-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 text-3xl">
                  🎲
                </div>
                <p className="text-zinc-500">Run an analysis to see results</p>
                <p className="text-zinc-600 text-sm mt-2">Payment required via x402</p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="size-12 border-4 border-zinc-700 border-t-emerald-500 rounded-full animate-spin mb-4" />
                <p className="text-zinc-400">Running game theory analysis...</p>
              </div>
            )}

            {result?.error && (
              <div className="bg-amber-950/50 border border-amber-800/50 rounded-xl p-4">
                <p className="text-amber-400">{result.error}</p>
                <div className="mt-4 text-sm text-zinc-400">
                  <p className="font-medium mb-2">To pay with x402:</p>
                  <pre className="bg-zinc-800 rounded-lg p-3 overflow-x-auto text-xs">
{`curl -X POST /entrypoints/${activeTab}/invoke \\
  -H "X-PAYMENT: <signature>" \\
  -H "Content-Type: application/json" \\
  -d '{"input": {...}}'`}
                  </pre>
                </div>
              </div>
            )}

            {result?.output && (
              <div className="overflow-y-auto max-h-[600px]">
                <pre className="text-sm text-zinc-300 whitespace-pre-wrap">
                  {JSON.stringify(result.output, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* API Info */}
        <div className="mt-8 bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <span>💻</span> API Access
          </h3>
          <p className="text-sm text-zinc-400 mb-4">
            Use this agent programmatically via x402 HTTP-native payments on Base.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-zinc-500 mb-2">Example Request</p>
              <pre className="bg-zinc-800 rounded-lg p-4 text-xs overflow-x-auto">
{`POST /entrypoints/analyze/invoke
Content-Type: application/json
X-PAYMENT: <x402_payment_signature>

{
  "input": {
    "protocol": "Uniswap V3",
    "depth": "thorough"
  }
}`}
              </pre>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-2">Endpoints & Pricing</p>
              <div className="bg-zinc-800 rounded-lg p-4 space-y-2">
                {ENTRYPOINTS.map((ep) => (
                  <div key={ep.key} className="flex justify-between text-sm">
                    <span className="text-zinc-400">/entrypoints/{ep.key}/invoke</span>
                    <span className="text-emerald-400 font-mono">{ep.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between text-sm text-zinc-500">
          <p>
            Built by{" "}
            <a href="https://x.com/spoobsV1" className="text-zinc-400 hover:text-white">
              @spoobsV1
            </a>
          </p>
          <div className="flex items-center gap-4">
            <a href="/.well-known/agent-card.json" className="hover:text-white">
              Agent Card
            </a>
            <a href="/.well-known/x402" className="hover:text-white">
              x402 Discovery
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
