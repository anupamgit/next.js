import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  agentRules: false,
  experimental: {
    requestInsights: true,
  },
}

export default nextConfig
