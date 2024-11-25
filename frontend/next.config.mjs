/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "export",
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
};

export default nextConfig;
