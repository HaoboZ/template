import bundleAnalyzer from '@next/bundle-analyzer';
import { pipe } from 'remeda';

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	swcMinify: true,
	headers: async () => [
		{ source: '/api/:path*', headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }] },
	],
};

export default pipe(
	nextConfig,
	bundleAnalyzer({
		enabled: !process.env.NEXT_PUBLIC_VERCEL_ENV && process.env.NODE_ENV !== 'development',
	}),
);
