/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true, // Disable image optimization if you are statically exporting
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
  //     },
  //   ];
  // },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // Make sure this is set in Amplify
  },
};

export default nextConfig;
