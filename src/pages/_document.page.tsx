import createCache from '@emotion/cache';
import createEmotionServer from '@emotion/server/create-instance';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import { Children } from 'react';
import info from '../../package.json';

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
		// noinspection HtmlRequiredTitleElement
		return (
			<Html lang='en'>
				<Head>
					<meta charSet='utf-8'/>
					{/*seo*/}
					{'description' in info && <meta name='description' content={info.description}/>}
					{'keywords' in info && <meta name='keywords' content={info.keywords.join( ', ' )}/>}
					{'author' in info && <meta name='author' content={info.author}/>}
					
					{/*pwa*/}
					{/*<link rel='icon' type='image/png' sizes='16x16' href='/icons/favicon-16x16.png'/>*/}
					{/*<link rel='icon' type='image/png' sizes='32x32' href='/icons/favicon-32x32.png'/>*/}
					{/*ios*/}
					<meta name='apple-mobile-web-app-capable' content='yes'/>
					<meta name='apple-mobile-web-app-status-bar-style' content='black-translucent'/>
					
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
