import type { EmotionCache } from '@emotion/cache';
import type { ReactNode } from 'react';
import Providers from './providers';

export default function Layout( { emotionCache, children }: {
	emotionCache?: EmotionCache,
	children: ReactNode
} ) {
	return (
		<Providers emotionCache={emotionCache}>
			{children}
		</Providers>
	);
}
