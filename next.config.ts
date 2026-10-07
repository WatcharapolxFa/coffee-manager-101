import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],   // menu photos use 90 so glass, ice and foam stay crisp
    // Menu photos are requested as /menu-photos/<slug>/<file>?v=<content hash>
    // (see scripts/gen-menu-images.mjs), so any ?v= is allowed there; other images take no query.
    localPatterns: [
      { pathname: '/menu-photos/**' },
      { pathname: '/**', search: '' },
    ],
  },
};

export default nextConfig;
