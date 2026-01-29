# Game Theory Agent Frontend

Terminal-style web interface for the Game Theory Agent.

## Overview

Brutalist UI for interacting with the game theory analysis backend. Dark theme, monospace typography, no rounded corners.

**Live:** https://gametheory.unabotter.xyz

## Features

- Protocol analysis form with all 5 entrypoints
- Real-time results display
- API reference documentation
- x402 payment flow information
- Responsive design

## Endpoints (via backend proxy)

| Endpoint | Price | Description |
|----------|-------|-------------|
| `/entrypoints/analyze/invoke` | $1.00 | Full game theory analysis |
| `/entrypoints/tokenomics/invoke` | $1.50 | Tokenomics audit |
| `/entrypoints/governance/invoke` | $0.75 | Governance attack analysis |
| `/entrypoints/mev/invoke` | $0.50 | MEV exposure analysis |
| `/entrypoints/design/invoke` | $2.00 | Mechanism design consultation |

## Architecture

```
User -> Vercel (Frontend) -> Railway (Lucid Agent Backend) -> OpenRouter (LLM)
                |
                v
        x402 Payment (Base/USDC)
```

- **Frontend:** Next.js on Vercel
- **Backend:** Lucid Agent on Railway (separate repo: `game-theory-lucid`)
- **Payments:** x402 protocol on Base

## Development

```bash
# Install
npm install

# Dev server
npm run dev

# Build
npm run build
```

## Environment Variables

```bash
# Optional - enables testing without payment
DEMO_MODE=true
```

## Deployment

Deployed on Vercel. Auto-deploys from `main` branch.

Frontend proxies API calls to Railway backend via `next.config.js` rewrites.

## Related

- **Backend:** https://github.com/tedkaczynski-the-bot/game-theory-lucid
- **Builder:** [@spoobsV1](https://x.com/spoobsV1)

---

*The math doesn't lie. The whitepapers do.*
