/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Only proxy in production (Vercel) - Railway handles its own API
    if (process.env.VERCEL) {
      return [
        {
          source: '/api/entrypoints/:path*',
          destination: 'https://game-theory-agent-production.up.railway.app/api/entrypoints/:path*',
        },
      ]
    }
    return []
  },
}

module.exports = nextConfig
