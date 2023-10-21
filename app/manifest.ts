import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Template',
		short_name: 'Template',
		description: 'template',
		categories: ['template'],
		scope: '/',
		start_url: '/',
		display: 'standalone',
		orientation: 'portrait',
		theme_color: '#ffffff',
		background_color: '#ffffff',
	};
}
