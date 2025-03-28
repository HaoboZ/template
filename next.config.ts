import bundleAnalyzer from '@next/bundle-analyzer';
import { pipe } from 'remeda';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	headers: async () => [
		{ source: '/api/:path*', headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }] },
	],
};

export default pipe(
	nextConfig,
	bundleAnalyzer({
		enabled: !!process.env.ANALYZE && process.env.NODE_ENV !== 'development',
	}),
);
