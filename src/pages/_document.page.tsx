import createCache from '@emotion/cache';
import createEmotionServer from '@emotion/server/create-instance';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import { Children } from 'react';
import type { PackageJson } from 'type-fest';
import _packageJson from '../../package.json';

const packageJson = _packageJson as PackageJson;

// noinspection JSUnusedGlobalSymbols
export default class _Document extends Document {
	static async getInitialProps( ctx ) {
		const emotionCache = createCache( { key: 'css', prepend: true } );
		const { extractCriticalToChunks } = createEmotionServer( emotionCache );
		
		const originalRenderPage = ctx.renderPage;
		ctx.renderPage = () => originalRenderPage( {
			enhanceApp: ( App ) => ( props ) => (
				<App {...props} emotionCache={emotionCache}/>
			)
		} );
		
		const initialProps = await Document.getInitialProps( ctx );
		
		const emotionStyles = extractCriticalToChunks( initialProps.html );
		const emotionStyleTags = emotionStyles.styles.map( ( style ) => (
			<style
				key={style.key}
				data-emotion={`${style.key} ${style.ids.join( ' ' )}`}
				dangerouslySetInnerHTML={{ __html: style.css }}
			/>
		) );
		
		return {
			...initialProps,
			styles: [ ...Children.toArray( initialProps.styles ), ...emotionStyleTags ]
		};
	}
	
	render() {
		return (
			<Html lang='en'>
				<Head>
					<meta charSet='utf-8'/>
					{/*seo*/}
					{'description' in packageJson && <meta name='description' content={packageJson.description}/>}
					{'keywords' in packageJson && <meta name='keywords' content={packageJson.keywords.join( ', ' )}/>}
					{'author' in packageJson && <meta name='author' content={packageJson.author as string}/>}
					{/*pwa*/}
					<link rel='shortcut icon' href='/favicon.ico'/>
					<meta name='mobile-web-app-capable' content='yes'/>
					<link rel='manifest' href='/app.webmanifest'/>
					{/*ios*/}
					<meta name='apple-mobile-web-app-capable' content='yes'/>
					<meta name='apple-mobile-web-app-status-bar-style' content='black-translucent'/>
					{/*font*/}
					<link
						rel='stylesheet'
						href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
					/>
					<link
						rel='stylesheet'
						href='https://fonts.googleapis.com/icon?family=Material+Icons'
					/>
				</Head>
				<body>
					<Main/>
					<NextScript/>
				</body>
			</Html>
		);
	}
}
