import type { NextConfig } from 'next';
import menuImages from './src/data/menu-images.json';

// Menu photos are requested as /menu-photos/<slug>/<file>?v=<content hash> (see scripts/gen-menu-images.mjs).
// In production only those exact URLs may be optimized; dev allows any ?v= because the
// manifest is regenerated while the server is running.
const photoPatterns = Object.values(menuImages as Record<string, Record<string, string>>)
  .flatMap(folder => Object.values(folder))
  .map(url => {
    const [pathname, query] = url.split('?');
    return { pathname, search: `?${query}` };
  });

const nextConfig: NextConfig = {
  images: {
    localPatterns: process.env.NODE_ENV === 'development'
      ? [{ pathname: '/menu-photos/**' }, { pathname: '/**', search: '' }]
      : [...photoPatterns, { pathname: '/**', search: '' }],
  },
};

export default nextConfig;
