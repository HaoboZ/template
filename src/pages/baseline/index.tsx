import type { EmotionCache } from '@emotion/cache';
import type { ReactNode } from 'react';
import Providers from './providers';
import RouterProgress from './routerProgress';

export default function Baseline( { emotionCache, children }: {
	emotionCache: EmotionCache,
	children: ReactNode
} ) {
	return (
		<Providers emotionCache={emotionCache}>
			<RouterProgress/>
			{children}
		</Providers>
	);
}
