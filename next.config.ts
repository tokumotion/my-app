import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  eslint: {
    // Option 1: Disable ESLint completely during builds
    ignoreDuringBuilds: true,

    // Option 2: Configure specific rules
    // This is commented out since we're using Option 1 above
    /*
    dirs: ['pages', 'components', 'lib', 'src', 'app'],  // Directories to lint
    ignoreDuringBuilds: false,  // Don't ignore during builds
    */
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',  // Add this for Google user profile images
    ],
  },
};

export default nextConfig;
