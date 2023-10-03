/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    LIT_RELAY_API_KEY: process.env.LIT_RELAY_API_KEY,
  },
};

module.exports = nextConfig;