import bundleAnalyzer from '@next/bundle-analyzer';

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	swcMinify: true,
	headers: async () => [
		{
			// matching all API routes
			source: '/api/:path*',
			headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
		},
	],
	experimental: { optimizePackageImports: ['@mui/joy'] },
};

const plugins = [bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })];

export default plugins.reduceRight((acc, plugin) => plugin(acc), nextConfig);
