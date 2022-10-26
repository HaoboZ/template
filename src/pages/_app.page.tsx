import type { EmotionCache } from '@emotion/cache';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import DataProvider from '../providers/data';
import Layout from './layout';
import './layout/style.scss';

// noinspection JSUnusedGlobalSymbols
export default function _App( { Component, pageProps, emotionCache }: {
	emotionCache: EmotionCache
} & AppProps ) {
	return (
		<DataProvider data={pageProps}>
			<Head>
				<title>Template</title>
				<meta name='viewport' content='width=device-width, initial-scale=1, viewport-fit=cover'/>
			</Head>
			<Layout emotionCache={emotionCache}>
				<Component {...pageProps}/>
			</Layout>
		</DataProvider>
	);
}
