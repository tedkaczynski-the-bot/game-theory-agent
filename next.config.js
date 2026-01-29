/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Proxy to Railway Lucid agent backend
    return [
      {
        source: '/entrypoints/:path*',
        destination: 'https://game-theory-agent-production.up.railway.app/entrypoints/:path*',
      },
      {
        source: '/.well-known/agent-card.json',
        destination: 'https://game-theory-agent-production.up.railway.app/.well-known/agent-card.json',
      },
    ]
  },
}

module.exports = nextConfig
