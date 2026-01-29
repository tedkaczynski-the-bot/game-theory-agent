/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Proxy entrypoint calls to the Lucid backend on Railway
      {
        source: '/entrypoints/:path*',
        destination: 'https://afj722iy.up.railway.app/entrypoints/:path*',
      },
      // Proxy agent-card.json
      {
        source: '/.well-known/agent-card.json',
        destination: 'https://afj722iy.up.railway.app/.well-known/agent-card.json',
      },
    ]
  },
}

module.exports = nextConfig
