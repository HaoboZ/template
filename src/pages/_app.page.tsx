import type { EmotionCache } from '@emotion/cache';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import DataProvider from '../providers/data';
import Baseline from './baseline';
import './baseline/style.scss';

// noinspection JSUnusedGlobalSymbols
export default function _App( { Component, pageProps, emotionCache }: {
	emotionCache: EmotionCache
} & AppProps ) {
	return (
		<DataProvider data={pageProps}>
			<Head>
				<title>Template</title>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1'
				/>
			</Head>
			<Baseline emotionCache={emotionCache}>
				<Component {...pageProps}/>
			</Baseline>
		</DataProvider>
	);
}
