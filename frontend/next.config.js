/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname:
          process.env.NEXT_PUBLIC_APP_ENV === "development"
            ? "127.0.0.1"
            : "api.tokounigha.com",
      },
      {
        hostname: "placehold.co",
      },
    ],
  },
  experimental: {
    scrollRestoration: true,
  },
};

module.exports = nextConfig;
