/** @type {import('next').NextConfig} */

const nextConfig = {
  // output: "export",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
  images: {
    unoptimized: true, // Disable image optimization if you are statically exporting
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // Make sure this is set in Amplify
  },
};

export default nextConfig;
