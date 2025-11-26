/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'porto': false,
        '@exodus/solana-connector': false,
        '@react-native-async-storage/async-storage': false,
        'react-native': false,
      }
    }

    return config
  },
}

module.exports = nextConfig
