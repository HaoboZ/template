import bundleAnalyzer from '@next/bundle-analyzer';
import withPWA from 'next-pwa';

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	pageExtensions: [ 'page.js', 'page.jsx', 'page.ts', 'page.tsx' ],
	typescript    : { ignoreBuildErrors: true },
	headers       : async () => [ {
		// matching all API routes
		source : '/api/:path*',
		headers: [ { key: 'Access-Control-Allow-Origin', value: '*' } ]
	} ],
	experimental  : {
		modularizeImports: {
			'@mui/icons-material': { transform: '@mui/icons-material/{{member}}' }
		},
		images           : {
			unoptimized: Boolean( process.env.NEXT_PUBLIC_SERVER_URL )
		}
	}
};

const plugins = [
	bundleAnalyzer( { enabled: process.env.ANALYZE === 'true' } ),
	withPWA, {
		pwa: {
			disable: Boolean( process.env.NEXT_PUBLIC_SERVER_URL ) || process.env.NODE_ENV === 'development',
			dest   : 'public'
		}
	}
];

// noinspection JSUnusedGlobalSymbols
export default plugins.reduceRight( ( acc, plugin ) =>
	typeof plugin === 'function' ? plugin( acc ) : ( { ...nextConfig, ...plugin } ), nextConfig );
